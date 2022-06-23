import {merge} from "../helpers/merge.js"
import {vector} from "../primitives/vector.js"

export const ORIGIN_TOP_LEFT = "top-left" //+
export const ORIGIN_TOP_RIGHT = "top-right" //+
export const ORIGIN_BOTTOM_RIGHT = "bottom-right" //+
export const ORIGIN_BOTTOM_LEFT = "bottom-left" //+
export const ORIGIN_TOP_CENTER = "top-center" //+
export const ORIGIN_BOTTOM_CENTER = "bottom-center" //+
export const ORIGIN_CENTER_CENTER = "center-center" //+
export const ORIGIN_LEFT_CENTER = "left-center" //+
export const ORIGIN_RIGHT_CENTER = "right-center" //+

export const defaultAxisStyle = {
    color: "#000",
    dash: [],
    size: 1,
    factor: 20
}

export const defaultAxisesStyle = {
    origin: ORIGIN_CENTER_CENTER,
    padding: 0,
    x: {
        ...defaultAxisStyle
    },
    y: {
        ...defaultAxisStyle
    },
}

export const drawAxis = (ctx, style) => {
    const arrowsStyle = merge({}, defaultAxisesStyle, style)
    const {x: axisX, y: axisY, origin, padding} = arrowsStyle
    const styleX = merge({}, defaultAxisStyle, axisX)
    const styleY = merge({}, defaultAxisStyle, axisY)
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    let x, y, x2, y2

    const arrowLeft = () => {
        vector(ctx,{x, y},{x: x + styleX.factor, y: y - styleX.factor / 2}, styleX)
        vector(ctx,{x, y},{x: x + styleX.factor, y: y + styleX.factor / 2}, styleX)
    }

    const arrowRight = () => {
        vector(ctx,{x: x2, y},{x: x2 - styleX.factor, y: y - styleX.factor / 2}, styleX)
        vector(ctx,{x: x2, y},{x: x2 - styleX.factor, y: y + styleX.factor / 2}, styleX)
    }

    const arrowUp = () => {
        vector(ctx, {x, y}, {x: x - styleY.factor / 2, y: y + styleY.factor}, styleY)
        vector(ctx, {x, y}, {x: x + styleY.factor / 2, y: y + styleY.factor}, styleY)
    }

    const arrowDown = () => {
        vector(ctx, {x, y: y2}, {x: x - styleY.factor / 2, y: y2 - styleY.factor}, styleY)
        vector(ctx, {x, y: y2}, {x: x + styleY.factor / 2, y: y2 - styleY.factor}, styleY)
    }

    if (origin === ORIGIN_CENTER_CENTER) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = (height - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = (width - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_RIGHT) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = height - padding - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = width - padding - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }

    if (origin === ORIGIN_TOP_RIGHT) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = padding + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = width - padding - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_CENTER) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = height - padding - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = (width - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }

    if (origin === ORIGIN_TOP_CENTER) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = padding + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = (width - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_LEFT_CENTER) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = (height - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = padding + styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_RIGHT_CENTER) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = (height - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = width - (padding + styleY.size)
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_TOP_LEFT) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = padding + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = padding + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_LEFT) {
        if (styleX) {
            x = padding; x2 = width - padding
            y = height - padding - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding; y2 = height - padding
            x = padding + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }
}