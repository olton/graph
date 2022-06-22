import {line} from "../primitives/line.js";

export const ORIGIN_TOP_LEFT = "top-left"
export const ORIGIN_TOP_RIGHT = "top-right"
export const ORIGIN_BOTTOM_RIGHT = "bottom-right"
export const ORIGIN_BOTTOM_LEFT = "bottom-left"
export const ORIGIN_TOP_CENTER = "top-center"
export const ORIGIN_BOTTOM_CENTER = "bottom-center"
export const ORIGIN_CENTER_CENTER = "center-center"

export const defaultArrowStyle = {
    color: "#000",
    dash: [],
    size: 1,
    factor: 20
}

export const defaultArrowsStyle = {
    origin: ORIGIN_CENTER_CENTER,
    padding: 0,
    x: {
        ...defaultArrowStyle
    },
    y: {
        ...defaultArrowStyle
    },
}

export const drawArrows = (ctx, style) => {
    const arrowsStyle = Object.assign({}, defaultArrowsStyle, style)
    const {x: arrowX, y: arrowY, origin, padding} = arrowsStyle
    const styleX = Object.assign({}, defaultArrowStyle, arrowX)
    const styleY = Object.assign({}, defaultArrowStyle, arrowY)
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    let x, y, x2, y2

    const arrowLeft = () => {
        line(ctx,{x: x2, y},{x: x2 - arrowX.factor, y: y - arrowX.factor / 2}, styleX)
        line(ctx,{x: x2, y},{x: x2 - arrowX.factor, y: y + arrowX.factor / 2}, styleX)
    }

    const arrowRight = () => {
        line(ctx,{x, y},{x: x + arrowX.factor, y: y - arrowX.factor / 2}, styleX)
        line(ctx,{x, y},{x: x + arrowX.factor, y: y + arrowX.factor / 2}, styleX)
    }

    const arrowUp = () => {
        line(ctx, {x, y}, {x: x - arrowY.factor / 2, y: y + arrowY.factor}, styleY)
        line(ctx, {x, y}, {x: x + arrowY.factor / 2, y: y + arrowY.factor}, styleY)
    }

    const arrowDown = () => {
        line(ctx, {x, y: y2}, {x: x - arrowY.factor / 2, y: y2 - arrowY.factor}, styleY)
        line(ctx, {x, y: y2}, {x: x + arrowY.factor / 2, y: y2 - arrowY.factor}, styleY)
    }

    if (origin === ORIGIN_CENTER_CENTER) {
        if (arrowX) {
            x = padding; x2 = width - padding
            y = (height - arrowX.size) / 2; y2 = y
            line(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (arrowX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (arrowY) {
            y = padding; y2 = height - padding
            x = (width - arrowY.size) / 2
            line(ctx,{x, y},{x, y: y2}, styleY)
            if (arrowY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_TOP_LEFT) {
        if (arrowX) {
            x = padding; x2 = width - padding
            y = padding + styleX.size; y2 = y
            line(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (arrowX.factor) {
                arrowLeft()
            }
        }
        if (arrowY) {
            y = padding; y2 = height - padding
            x = padding + styleY.size; x2 = x
            line(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (arrowY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_LEFT) {
        if (arrowX) {
            x = padding; x2 = width - padding
            y = height - padding - styleX.size; y2 = y
            line(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (arrowX.factor) {
                arrowLeft()
            }
        }
        if (arrowY) {
            y = padding; y2 = height - padding
            x = padding + styleY.size; x2 = x
            line(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (arrowY.factor) {
                arrowUp()
            }
        }
    }
}