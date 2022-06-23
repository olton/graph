import {line} from "../primitives/line.js"
import {merge} from "../helpers/merge.js";
import {dot} from "../primitives/dot.js";
import {vector} from "../primitives/vector.js";

export const defaultCrossLineStyle = {
    size: 1,
    dash: [5, 5],
    color: "#000"
}

export const defaultCrossArcStyle = {
    size: 1,
    dash: [4, 4],
    color: "#000",
    fill: "transparent",
    radius: 20,
}

export const defaultCrossStyle = {
    padding: 0,
    line: {
        ...defaultCrossLineStyle
    },
    arc: {
        ...defaultCrossArcStyle
    }
}

export const drawCross = (ctx, style, {proxy, dpi = 2}) => {
    const crossStyle = merge({}, defaultCrossStyle, style)
    const {padding, line: lineStyle, arc: arcStyle} = crossStyle
    const crossLineStyle = merge({}, defaultCrossLineStyle, lineStyle)
    const crossArcStyle = merge({}, defaultCrossArcStyle, arcStyle)
    const rect = ctx.canvas.getBoundingClientRect()
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    if (!proxy || !proxy.mouse) return

    let {x, y} = proxy.mouse

    x = (x - rect.left) * dpi
    y = (y - rect.top) * dpi

    vector(ctx, {x, y: padding}, {x, y: height - padding}, crossLineStyle)
    vector(ctx, {x: padding, y}, {x: width - padding, y}, crossLineStyle)
    dot(ctx, [x, y, arcStyle.radius], crossArcStyle)
}