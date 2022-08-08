import {merge} from "../helpers/merge.js";
import {drawVector} from "../primitives/vector.js";

export const defaultGridLineStyle = {
    color: "#e7e7e7",
    dash: [],
    size: 1,
    count: 50
}

export const defaultGridStyle = {
    v: {
        ...defaultGridLineStyle
    },
    h: {
        ...defaultGridLineStyle
    }
}

export function drawGrid (ctx, options = {}) {
    const gridStyle = merge({}, defaultGridStyle, options)
    const {h, v} = gridStyle
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = this.padding
    const stepX = ((width - (padding.left + padding.right) ) / v.count)
    const stepY = ((height - (padding.top + padding.bottom) ) / h.count)
    let x, y, c

    x = padding.left
    y = padding.top
    c = 0
    do  {
        drawVector(ctx, {x, y}, {x: width - padding.right, y}, h)
        y += stepY
        c++
    } while (c <= h.count)

    x = padding.left
    y = padding.top
    c = 0
    do {
        drawVector(ctx, {x, y}, {x, y: height - padding.bottom}, v)
        x += stepX
        c++
    } while (c <= v.count)
}