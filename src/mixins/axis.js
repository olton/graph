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

export const defaultAxisLineStyle = {
    color: "#000",
    dash: [],
    size: 1,
    factor: 20
}

export const defaultAxisStyle = {
    origin: ORIGIN_CENTER_CENTER,
    padding: 0,
    x: {
        ...defaultAxisLineStyle
    },
    y: {
        ...defaultAxisLineStyle
    },
}

export function drawAxis (ctx, options = {}) {
    const axisStyle = merge({}, defaultAxisStyle, options)
    const {x: styleX, y: styleY, origin} = axisStyle
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = this.padding
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
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_RIGHT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - padding.right - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }

    if (origin === ORIGIN_TOP_RIGHT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - padding.right - styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }

    if (origin === ORIGIN_TOP_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_LEFT_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_RIGHT_CENTER) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowLeft()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = width - (padding.right + styleY.size)
            vector(ctx,{x, y},{x, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_TOP_LEFT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = padding.top + styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowDown()
            }
        }
    }

    if (origin === ORIGIN_BOTTOM_LEFT) {
        if (styleX) {
            x = padding.left; x2 = width - padding.right
            y = height - padding.bottom - styleX.size; y2 = y
            vector(ctx,{x, y},{x: x2, y: y2}, styleX)
            if (styleX.factor) {
                arrowRight()
            }
        }
        if (styleY) {
            y = padding.top; y2 = height - padding.bottom
            x = padding.left + styleY.size; x2 = x
            vector(ctx,{x, y},{x: x2, y: y2}, styleY)
            if (styleY.factor) {
                arrowUp()
            }
        }
    }
}

export const origin = (x, y, w, h, o, p = {}) => {
    let _x = x, _y = y
    const {top, left, right, bottom} = p

    switch (o) {
        case ORIGIN_CENTER_CENTER: {
            _x += w / 2 + left
            _y += h / 2 + top
            break
        }
        case ORIGIN_BOTTOM_RIGHT: {
            _x = w + _x + left
            _y = h - _y + top
            break
        }
        case ORIGIN_TOP_RIGHT: {
            _x += w + left
            _y = - _y + top
            break
        }
        case ORIGIN_BOTTOM_CENTER: {
            _x += w / 2 + left
            _y = h - _y + top
            break
        }
        case ORIGIN_TOP_CENTER: {
            _x += w / 2 + left
            _y = - _y + top
            break
        }
        case ORIGIN_LEFT_CENTER: {
            _x += left
            _y = h / 2 - _y + top
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            _x = w + _x + left
            _y = h / 2 - _y + top
            break
        }
        case ORIGIN_TOP_LEFT: {
            _x += left
            _y =  - _y + top
            break
        }
        case ORIGIN_BOTTOM_LEFT: {
            _x += left
            _y = h - _y + top
            break
        }
    }

    return [_x, _y]
}