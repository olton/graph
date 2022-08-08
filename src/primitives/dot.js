import {drawArc} from "./arc.js";

export const drawDot = (ctx, [x, y, r], style = {}) => drawArc(ctx, [x, y, r, 0, 2 * Math.PI], {...style, fill: style.color})