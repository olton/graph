import {drawRoundedRect} from "./rouded-rect.js";

export const drawRect = (ctx, [x, y, w, h], style) => drawRoundedRect(ctx, [x, y, w, h, 0], style)