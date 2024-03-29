import { Circle } from './circle';
import { getHeight, getWidth, MAX_NUMBER_OF_CIRCLES, NUMBER_OF_CIRCLES, setHeight, setWidth } from './config';
import { map } from './util/map';

let circles: Circle[];
let ctx: CanvasRenderingContext2D;
let fps: number;
let lastAnimTime: DOMHighResTimeStamp;
let delta: DOMHighResTimeStamp;
let mouse: Circle;
let maxCircles: number = 0;

let mousePressed: boolean = false;

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
    mouse.x = ev.clientX - rect.left;
    mouse.y = ev.clientY - rect.top;
}

function resetMouseObject(ev?: MouseEvent) {
    if (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    mouse = new Circle(
        Infinity,
        Infinity,
        Infinity,
    );
    mouse.isMouse = true;
    mousePressed = false;
}

function addCirclesAtPoint(x: number, y: number, numCirclesToAdd?: number) {
    if (!x || !y) {
        return;
    }

    if (!numCirclesToAdd) {
        numCirclesToAdd = Math.min(Math.floor(circles.length * 0.1), maxCircles * 0.1);
    }

    for (let i = 0; i < numCirclesToAdd; i++) {
        circles.push(new Circle(x, y));
    }
}

function handleMouseClick(ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const { x, y } = mouse;

    addCirclesAtPoint(x, y);
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
    const chanceToRemove = (circles.length - maxCircles) / maxCircles;
    const circlesToRemove = Math.floor(map(chanceToRemove, 0, 1, 1, maxCircles * 0.1));

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
    // canvas.addEventListener('click', ev => handleMouseClick(ev))
    canvas.addEventListener('mousedown', () => mousePressed = true);
    canvas.addEventListener('mouseup', () => mousePressed = false);

    resetMouseObject();

    setWidth(canvas.width);
    setHeight(canvas.height);

    maxCircles = MAX_NUMBER_OF_CIRCLES();

    circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLES(); i++) {
        circles.push(Circle.getRandom());
    }

    isDevMode = import.meta.env.DEV;

    window.addEventListener('resize', () => {
        canvas.setAttribute('width', window.innerWidth.toString());
        canvas.setAttribute('height', window.innerHeight.toString());

        setWidth(canvas.width);
        setHeight(canvas.height);

        maxCircles = MAX_NUMBER_OF_CIRCLES();
    })

    window.requestAnimationFrame(draw);
}

function draw() {
    calculateFps();
    ctx.clearRect(0, 0, getWidth(), getHeight());

    cleanCircles();

    resetCanvas(ctx);

    if (mouse && mousePressed) {
        addCirclesAtPoint(mouse.x, mouse.y,2);
    }

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
        mouse.drawVisionCircle(ctx);
    }

    window.requestAnimationFrame(draw);
}

window.onload = setup;
