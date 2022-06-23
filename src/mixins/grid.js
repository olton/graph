import {merge} from "../helpers/merge.js";
import {vector} from "../primitives/vector.js";

export const defaultGridLineStyle = {
    color: "#e7e7e7",
    dash: [5, 5],
    size: 1,
    count: 50
}

export const defaultGridStyle = {
    v: {
        ...defaultGridLineStyle
    },
    h: {
        ...defaultGridLineStyle
    },
    padding: 0
}

export const drawGrid = (ctx, options = {}) => {
    const gridStyle = merge({}, defaultGridStyle, options)
    const {h, v, padding = 0} = gridStyle
    const vLineStyle = merge({}, defaultGridLineStyle, h)
    const hLineStyle = merge({}, defaultGridLineStyle, v)
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const stepX = ((width - padding * 2) / vLineStyle.count)
    const stepY = ((height - padding * 2) / hLineStyle.count)

    let y = padding
    let x = padding

    let counter = 0
    do  {
        vector(ctx, {x, y}, {x: width - padding, y}, hLineStyle)
        y += stepY
        counter++
    } while (counter <= hLineStyle.count)

    y = padding
    x = padding
    counter = 0
    do {
        vector(ctx, {x, y}, {x, y: height - padding}, vLineStyle)
        x += stepX
        counter++
    } while (counter <= vLineStyle.count)
}