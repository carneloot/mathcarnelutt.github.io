export const MIN_RADIUS = 2;
export const MAX_RADIUS = 7;

export const MAX_VELOCITY = 2;

export const NUMBER_OF_CIRCLES = (window.innerWidth < 700) ? 20 : 75;
export const MAX_NUMBER_OF_CIRCLES = NUMBER_OF_CIRCLES * 2;

export const DRAW_LINE_THRESHOLD = 150;
export const DRAW_LINE_THRESHOLD_SQUARED = DRAW_LINE_THRESHOLD * DRAW_LINE_THRESHOLD;

export const DRAW_LINE_MOUSE_THRESHOLD = DRAW_LINE_THRESHOLD * 1.25;
export const DRAW_LINE_MOUSE_THRESHOLD_SQUARED = DRAW_LINE_MOUSE_THRESHOLD * DRAW_LINE_MOUSE_THRESHOLD;

export const CIRCLE_COLOR = 'rgb(175, 175, 175)';
export const LINE_COLOR = 'rgb(175, 175, 175, {opacity})';

let width;
let height;

export const setWidth = v => width = v;
export const setHeight = v => height = v;

export const getWidth = () => width;
export const getHeight = () => height;