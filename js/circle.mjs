import {
    CIRCLE_COLOR,
    DRAW_LINE_MOUSE_THRESHOLD_SQUARED,
    DRAW_LINE_THRESHOLD,
    DRAW_LINE_THRESHOLD_SQUARED, getHeight, getWidth,
    LINE_COLOR, MAX_RADIUS,
    MAX_VELOCITY, MIN_RADIUS,
} from './config.mjs';

export class Circle {

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
        if (this.x - this.radius >= getWidth()) {
            this.x = 0 - this.radius;
        } else if (this.x + this.radius <= 0) {
            this.x = getWidth() + this.radius;
        }

        if (this.y - this.radius >= getHeight()) {
            this.y = 0 - this.radius;
        } else if (this.y + this.radius <= 0) {
            this.y = getHeight() + this.radius;
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
            ctx.moveTo(this.x, this.y);
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

    static getRandom(
        x = Math.random() * getWidth(),
        y = Math.random() * getHeight(),
    ) {
        const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);

        return new Circle(x, y, radius);
    }
}
