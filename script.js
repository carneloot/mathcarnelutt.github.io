const MIN_RADIUS = 2;
const MAX_RADIUS = 7;

const MAX_VELOCITY = 2;

const NUMBER_OF_CIRCLES = (window.innerWidth < 700) ? 20 : 50;

const DRAW_LINE_THRESHOLD = 150;
const DRAW_LINE_THRESHOLD_SQUARED = DRAW_LINE_THRESHOLD * DRAW_LINE_THRESHOLD;

const DRAW_LINE_MOUSE_THRESHOLD = DRAW_LINE_THRESHOLD * 1.25;
const DRAW_LINE_MOUSE_THRESHOLD_SQUARED = DRAW_LINE_MOUSE_THRESHOLD * DRAW_LINE_MOUSE_THRESHOLD;

const CIRCLE_COLOR = 'rgb(175, 175, 175)';
const LINE_COLOR = 'rgb(175, 175, 175, {opacity})';

class Circle {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;

        this.radius = radius;

        this.dx = Math.random() * MAX_VELOCITY * 2 - MAX_VELOCITY;
        this.dy = Math.random() * MAX_VELOCITY * 2 - MAX_VELOCITY;

        this.isMouse = false;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        this.handleEdges();
    }

    handleEdges() {
        if (this.x - this.radius >= width) {
            this.x = 0 - this.radius;
        } else if (this.x + this.radius <= 0) {
            this.x = width + this.radius;
        }

        if (this.y - this.radius >= height) {
            this.y = 0 - this.radius;
        } else if (this.y + this.radius <= 0) {
            this.y = height + this.radius;
        }
    }

    draw(ctx) {
        ctx.fillStyle = CIRCLE_COLOR;

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);

        ctx.fill();
    }

    distanceSquared(other) {
        const { x: tX, y: tY } = this;
        const { x: oX, y: oY } = other;

        const dx = tX - oX;
        const dy = tY - oY;

        return dx * dx + dy * dy;
    }

    drawLine(other, ctx) {
        const distanceSquared = this.distanceSquared(other);

        const threshold = (other.isMouse)
            ? DRAW_LINE_MOUSE_THRESHOLD_SQUARED
            : DRAW_LINE_THRESHOLD_SQUARED;

        if (distanceSquared <= threshold) {
            // Draw line
            
            const maxLineWidth = Math.min(this.radius, other.radius) * 0.6;
            const percentDistance = 1 - distanceSquared / threshold;
            
            const lineWidth = 1 + percentDistance * (maxLineWidth - 1);
            const opacity = 0.1 + percentDistance * 0.6;
            
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = LINE_COLOR.replace('{opacity}', opacity.toString());

            ctx.beginPath();
            ctx.moveTo(this.x,  this.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
        }
    }

    drawVisionCircle(ctx) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(this.x, this.y, DRAW_LINE_THRESHOLD, 0, 2 * Math.PI, true);
        ctx.stroke();
    }

    static getRandom() {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);

        return new Circle(x, y, radius);
    }
}

let circles, width, height, ctx, mouse;
function setup() {
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.setAttribute('width', window.innerWidth.toString());
    canvas.setAttribute('height', window.innerHeight.toString());

    canvas.addEventListener('mousemove', ev => updateMouseObject(ev));
    canvas.addEventListener('mouseleave', ev => resetMouseObject(ev));
    resetMouseObject();

    width = canvas.width;
    height = canvas.height;

    circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
        circles.push(Circle.getRandom());
    }
    
    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(0, 0, width, height);

    // Update loop
    for (const circle of circles) {
        circle.update();
    }

    // Draw loop
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        
        for (let j = i + 1; j < circles.length; j++) {
            const otherCircle = circles[j];
            circle.drawLine(otherCircle, ctx);
        }

        circle.drawLine(mouse, ctx);
        
        circle.draw(ctx);
    }

    // drawMouse(ctx);

    window.requestAnimationFrame(draw);
}
setup();

function drawMouse(ctx) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 1, 0, 2 * Math.PI, true);
    ctx.fill();
}

function updateMouseObject(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const rect = ev.target.getBoundingClientRect();
    mouse = {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
        radius: Infinity,
        isMouse: true,
    };
}

function resetMouseObject(ev) {
    if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    mouse = {
        x: Infinity,
        y: Infinity,
        radius: Infinity,
        isMouse: true,
    };
}