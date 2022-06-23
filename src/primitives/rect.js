import {roundedRect} from "./rouded-rect.js";

export const rect = (ctx, [x, y, w, h], style) => roundedRect(ctx, [x, y, w, h, 0], style)