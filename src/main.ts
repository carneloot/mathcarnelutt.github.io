import { Circle } from './circle';
import { getHeight, getWidth, NUMBER_OF_CIRCLES, setHeight, setWidth } from './config';
import { map } from './util/map';

let circles: Circle[];
let ctx: CanvasRenderingContext2D;
let fps: number;
let lastAnimTime: DOMHighResTimeStamp;
let delta: DOMHighResTimeStamp;
let mouse: Circle;

let desiredNumberOfCircles = NUMBER_OF_CIRCLES();

let mousePressed: boolean = false;

const isDevMode = import.meta.env.DEV;

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
        const diff = desiredNumberOfCircles - circles.length;
        numCirclesToAdd = diff < 0 ? 0 : Math.min(Math.floor(diff * 0.1), desiredNumberOfCircles * 0.1);
    }

    for (let i = 0; i < numCirclesToAdd; i++) {
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
    ctx.fillText(`${circles.length} / ${desiredNumberOfCircles}`, 10, getHeight() - 10);
}

function normalizeCircleNumber() {
    // Diff is positive if we need to add circles
    // Diff is negative if we need to remove circles
    const diff = desiredNumberOfCircles - circles.length;


    if (Math.abs(diff) == 0) {
        return;
    }

    const chanceToChange = Math.abs(diff) / desiredNumberOfCircles;
    const numberToChange = Math.floor(map(chanceToChange, 0, 1, 1, Math.max(desiredNumberOfCircles * 0.25, 1)));

    if (Math.random() > chanceToChange) {
        return;
    }

    const action = diff > 0
        ? () => circles.push(Circle.getRandom())
        : () => circles.splice(0, 1);

    for (let i = 0; i < numberToChange; i++) {
        action();
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

    circles = [];

    for (let i = 0; i < desiredNumberOfCircles * 0.3; i++) {
        circles.push(Circle.getRandom());
    }

    window.addEventListener('resize', () => {
        canvas.setAttribute('width', window.innerWidth.toString());
        canvas.setAttribute('height', window.innerHeight.toString());

        setWidth(canvas.width);
        setHeight(canvas.height);

        desiredNumberOfCircles = NUMBER_OF_CIRCLES();
    })

    window.requestAnimationFrame(draw);
}

function draw() {
    calculateFps();
    ctx.clearRect(0, 0, getWidth(), getHeight());

    normalizeCircleNumber();

    resetCanvas(ctx);

    if (mouse && mousePressed) {
        addCirclesAtPoint(mouse.x, mouse.y, 1);
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
