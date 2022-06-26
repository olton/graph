import {merge} from "../helpers/merge.js"
import {vector} from "../primitives/vector.js"
import {defaultLineStyle} from "../defaults/index.js";

export const ORIGIN_TOP_LEFT = "top-left" //+
export const ORIGIN_TOP_RIGHT = "top-right" //+
export const ORIGIN_BOTTOM_RIGHT = "bottom-right" //+
export const ORIGIN_BOTTOM_LEFT = "bottom-left" //+
export const ORIGIN_TOP_CENTER = "top-center" //+
export const ORIGIN_BOTTOM_CENTER = "bottom-center" //+
export const ORIGIN_CENTER_CENTER = "center-center" //+
export const ORIGIN_LEFT_CENTER = "left-center" //+
export const ORIGIN_RIGHT_CENTER = "right-center" //+

export const defaultAxisLineStyle = {
    factor: 20,
    subFactor: 2
}

export const defaultAxis = {
    origin: ORIGIN_BOTTOM_LEFT,
    padding: 0,
    x: {
        style: {
            ...defaultLineStyle,
            ...defaultAxisLineStyle
        }
    },
    y: {
        style: {
            ...defaultLineStyle,
            ...defaultAxisLineStyle
        }
    },
}

export function drawAxis (ctx, options = {}) {
    const axis = merge({}, defaultAxis, options)
    const {x: {style: styleX}, y: {style: styleY}, origin} = axis
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = this.padding

    let x, y, x2, y2, zero = {x: 0, y: 0}

    const arrowLeft = (x, y) => {
        vector(ctx,{x, y},{x: x + styleX.factor, y: y - styleX.factor / styleX.subFactor}, styleX)
        vector(ctx,{x, y},{x: x + styleX.factor, y: y + styleX.factor / styleX.subFactor}, styleX)
    }

    const arrowRight = (x, y) => {
        vector(ctx,{x, y},{x: x - styleX.factor, y: y - styleX.factor / styleX.subFactor}, styleX)
        vector(ctx,{x, y},{x: x - styleX.factor, y: y + styleX.factor / styleX.subFactor}, styleX)
    }

    const arrowUp = (x, y) => {
        vector(ctx, {x, y}, {x: x - styleY.factor / styleY.subFactor, y: y + styleY.factor}, styleY)
        vector(ctx, {x, y}, {x: x + styleY.factor / styleY.subFactor, y: y + styleY.factor}, styleY)
    }

    const arrowDown = (x, y) => {
        vector(ctx, {x, y}, {x: x - styleY.factor / styleY.subFactor, y: y - styleY.factor}, styleY)
        vector(ctx, {x, y}, {x: x + styleY.factor / styleY.subFactor, y: y - styleY.factor}, styleY)
    }

    if (origin === ORIGIN_CENTER_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
                arrowRight(x2, y)
            }
            zero.x = x + (x2-x)/2
        }
        if (styleY) {
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2; x2 = x
            y = padding.top; y2 = height - padding.bottom
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x, y)
                arrowDown(x, y2)
            }
            zero.y = y + (y2-y)/2
        }
    }

    if (origin === ORIGIN_BOTTOM_RIGHT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
            }
            zero.x = x2
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - padding.right - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x2, y)
            }
            zero.y = y2
        }
    }

    if (origin === ORIGIN_TOP_RIGHT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
            }
            zero.x = x2
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - padding.right - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown(x2, y2)
            }
            zero.y = y
        }
    }

    if (origin === ORIGIN_BOTTOM_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
                arrowRight(x2, y2)
            }
            zero.x = x + (x2-x)/2
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x, y)
            }
            zero.y = y2
        }
    }

    if (origin === ORIGIN_TOP_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
                arrowRight(x2, y2)
            }
            zero.x = x + (x2-x)/2
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown(x, y2)
            }
            zero.y = y
        }
    }

    if (origin === ORIGIN_LEFT_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight(x2, y)
            }
            zero.x = x
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x, y)
                arrowDown(x, y2)
            }
            zero.y = y + (y2-y)/2
        }
    }

    if (origin === ORIGIN_RIGHT_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft(x, y)
            }
            zero.x = x2
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - (padding.right + styleY.size)
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x2, y)
                arrowDown(x2, y2)
            }
            zero.y = y +(y2-y)/2
        }
    }

    if (origin === ORIGIN_TOP_LEFT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight(x2, y)
            }
            zero.x = x
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown(x, y2)
            }
            zero.y = y
        }
    }

    if (origin === ORIGIN_BOTTOM_LEFT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight(x2, y2)
            }
            zero.x = x
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp(x, y)
            }
            zero.y = y2
        }
    }
    return zero
}

export const toOrigin = (_x, _y, zero) => {
    const {x: zx, y: zy} = zero
    return [_x + zx -1 , _y + zy - _y*2 - 1]
}
