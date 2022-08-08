import {drawVector} from "../primitives/vector.js";
import {drawCircle} from "../primitives/circle.js";
import {drawSquare} from "../primitives/square.js";
import {drawDiamond} from "../primitives/diamond.js";
import {merge} from "../helpers/merge.js";
import {capitalize} from "../helpers/capitalize.js";

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
    type: "circle"
}

export const defaultCrossStyle = {
    line: {
        ...defaultCrossLineStyle
    },
    arc: {
        ...defaultCrossArcStyle
    }
}

const arcFunc = {
    drawDiamond,
    drawCircle,
    drawSquare
}

export function drawCross(ctx, options = {}){
    const {line: lineStyle, arc: arcStyle} = merge({}, defaultCrossStyle, options)
    const rect = ctx.canvas.getBoundingClientRect()
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const dpi = this.dpi
    const proxy = this.proxy
    const padding = this.padding

    if (!proxy || !proxy.mouse) return

    let {x, y} = proxy.mouse

    x = (x - rect.left) * dpi
    y = (y - rect.top) * dpi

    if ((y > padding.top && y < height - padding.bottom) && (x > padding.left && x < width - padding.right)) {
        drawVector(ctx, {x: padding.left, y}, {x: width - padding.right, y}, lineStyle)
        drawVector(ctx, {x, y: padding.top}, {x, y: height - padding.bottom}, lineStyle)

        if (arcStyle.type !== 'none') arcFunc[`draw${capitalize(arcStyle.type)}`](ctx, [x, y, arcStyle.radius], arcStyle)
    }
}