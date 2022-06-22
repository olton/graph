import {line} from "../primitives/line.js"
import {arc} from "../primitives/arc.js";

export const defaultCrossLineStyle = {
    size: 1,
    dash: [],
    color: "#000"
}

export const defaultCrossArcStyle = {
    size: 1,
    dash: [4, 4],
    color: "#000",
    radius: 10,
    startAngle: 0,
    endAngle: 2 * Math.PI
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
    const crossStyle = Object.assign({}, defaultCrossStyle, style)
    const {padding, line: lineStyle, arc: arcStyle} = crossStyle
    const crossLineStyle = Object.assign({}, defaultCrossLineStyle, lineStyle)
    const crossArcStyle = Object.assign({}, defaultCrossArcStyle, arcStyle)
    const rect = ctx.canvas.getBoundingClientRect()
    const width = ctx.canvas.width
    const height = ctx.canvas.height

    if (!proxy || !proxy.mouse) return

    let {x, y} = proxy.mouse

    x = (x - rect.left) * dpi
    y = (y - rect.top) * dpi

    line(ctx, {x, y: padding}, {x, y: height - padding}, crossLineStyle)
    line(ctx, {x: padding, y}, {x: width - padding, y}, crossLineStyle)
    arc(ctx, [x, y, arcStyle.radius, arcStyle.startAngle, arcStyle.endAngle], crossArcStyle)
}