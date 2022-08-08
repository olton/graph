import {drawDot} from "./dot.js";
import {drawArc} from "./arc.js";

export const drawCircle = (ctx, [x, y, r], style) => drawArc(ctx, [x, y, r, 0, 2 * Math.PI], style)