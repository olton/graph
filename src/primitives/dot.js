import {arc} from "./arc.js";

export const dot = (ctx, [x, y, r], style = {}) => arc(ctx, [x, y, r, 0, 2 * Math.PI], style)