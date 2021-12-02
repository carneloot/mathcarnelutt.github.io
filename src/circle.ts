import {
    CIRCLE_COLOR,
    DRAW_LINE_MOUSE_THRESHOLD_SQUARED,
    DRAW_LINE_THRESHOLD,
    DRAW_LINE_THRESHOLD_SQUARED,
    getHeight,
    getWidth,
    LINE_COLOR,
    MAX_RADIUS,
    MAX_VELOCITY,
    MIN_RADIUS,
} from './config';

export type CircleLike = {
    x: number;
    y: number;
    radius: number;
    isMouse: boolean;
}

export class Circle {
    private readonly dx = Math.random() * MAX_VELOCITY * 2 - MAX_VELOCITY;
    private readonly dy = Math.random() * MAX_VELOCITY * 2 - MAX_VELOCITY;

    public isMouse = false;

    constructor(
        public x: number,
        public y: number,
        public readonly radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS),
    ) {}

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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = CIRCLE_COLOR;

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);

        ctx.fill();
    }

    distanceSquared(other: CircleLike) {
        const { x: tX, y: tY } = this;
        const { x: oX, y: oY } = other;

        const dx = tX - oX;
        const dy = tY - oY;

        return dx * dx + dy * dy;
    }

    drawLine(other: CircleLike, ctx: CanvasRenderingContext2D) {
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
            ctx.strokeStyle = LINE_COLOR({ opacity });

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
        }
    }

    drawVisionCircle(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(this.x, this.y, DRAW_LINE_THRESHOLD, 0, 2 * Math.PI, true);
        ctx.stroke();
    }

    static getRandom() {
        return new Circle(Math.random() * getWidth(), Math.random() * getHeight());
    }
}
