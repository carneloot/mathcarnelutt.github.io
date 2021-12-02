import { Circle, CircleLike } from './circle';
import { getHeight, getWidth, MAX_NUMBER_OF_CIRCLES, NUMBER_OF_CIRCLES, setHeight, setWidth } from './config';
import { map } from './util/map';

let circles: Circle[];
let ctx: CanvasRenderingContext2D;
let fps: number;
let lastAnimTime: DOMHighResTimeStamp;
let delta: DOMHighResTimeStamp;
let mouse: CircleLike;

let isDevMode = false;

function calculateFps() {
    if (!lastAnimTime) {
        lastAnimTime = performance.now();
        fps = 0;
        return;
    }

    delta = (performance.now() - lastAnimTime) / 1000;
    lastAnimTime = performance.now();
    fps = 1 / delta;
}

function drawFps(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.font = '25px serif';
    ctx.textBaseline = 'top';
    ctx.fillText(Math.floor(fps).toString(), 10, 10);
}

function drawMouse(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 3, 0, 2 * Math.PI, true);
    ctx.fill();
}

function updateMouseObject(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const canvas = ev?.target! as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    mouse = {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
        radius: Infinity,
        isMouse: true,
    };
}

function resetMouseObject(ev?: MouseEvent) {
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

function handleMouseClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const { x, y } = mouse;

    const numCirclesAdd = Math.min(Math.floor(circles.length * 0.1), MAX_NUMBER_OF_CIRCLES * 0.1);

    for (let i = 0; i < numCirclesAdd; i++) {
        circles.push(new Circle(x, y));
    }
}

function resetCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(0, 0, getWidth(), getHeight());
}

function drawNumberOfCircles(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.font = '25px serif';
    ctx.textBaseline = 'bottom';
    ctx.fillText(circles.length.toString(), 10, getHeight() - 10);
}

function cleanCircles() {
    const chanceToRemove = (circles.length - MAX_NUMBER_OF_CIRCLES) / MAX_NUMBER_OF_CIRCLES;
    const circlesToRemove = Math.floor(map(chanceToRemove, 0, 1, 1, MAX_NUMBER_OF_CIRCLES * 0.1));

    if (Math.random() < chanceToRemove) {
        for (let i = 0; i < circlesToRemove; i++) {
            circles.splice(0, 1);
        }
    }
}

function setup() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d')!;
    canvas.setAttribute('width', window.innerWidth.toString());
    canvas.setAttribute('height', window.innerHeight.toString());

    canvas.addEventListener('mousemove', ev => updateMouseObject(ev));
    canvas.addEventListener('mouseleave', ev => resetMouseObject(ev));
    canvas.addEventListener('click', ev => handleMouseClick(ev))

    resetMouseObject();

    setWidth(canvas.width);
    setHeight(canvas.height);

    circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLES; i++) {
        circles.push(Circle.getRandom());
    }

    isDevMode = import.meta.env.DEV;

    window.requestAnimationFrame(draw);
}

function draw() {
    calculateFps();
    ctx.clearRect(0, 0, getWidth(), getHeight());

    cleanCircles();

    resetCanvas(ctx);

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

    if (isDevMode) {
        drawFps(ctx);
        drawNumberOfCircles(ctx);
        drawMouse(ctx);
    }

    window.requestAnimationFrame(draw);
}

window.onload = setup;
