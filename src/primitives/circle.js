import {dot} from "./dot.js";
import {arc} from "./arc.js";

export const circle = (ctx, [x, y, r], style) => arc(ctx, [x, y, r, 0, 2 * Math.PI], style)