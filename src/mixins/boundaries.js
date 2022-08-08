import {
    ORIGIN_BOTTOM_CENTER,
    ORIGIN_BOTTOM_LEFT, ORIGIN_BOTTOM_RIGHT,
    ORIGIN_CENTER_CENTER, ORIGIN_LEFT_CENTER, ORIGIN_RIGHT_CENTER,
    ORIGIN_TOP_CENTER,
    ORIGIN_TOP_LEFT,
    ORIGIN_TOP_RIGHT
} from "./axis.js";
import {drawCircle} from "../primitives/circle.js";
import {drawText} from "../primitives/text.js"

export const drawZeroBoundaries = (ctx, zero, origin, val, style) => {
    let x, y, t, tx, ty
    const {x: zx, y:zy} = zero

    x = zx
    y = zy

    console.log(style)

    switch (origin){
        case ORIGIN_CENTER_CENTER: {
            tx = x + 10
            ty = y - 16
            x -= 1
            y -= 1
            break
        }
        case ORIGIN_TOP_LEFT: {
            tx = x + 10
            ty = y + 16
            x += 2
            y += 2
            break
        }
        case ORIGIN_TOP_CENTER: {
            tx = x + 10
            ty = y + 16
            y += 2
            break
        }
        case ORIGIN_TOP_RIGHT: {
            tx = x - 36
            ty = y + 16
            x -= 2
            y += 2
            break
        }
        case ORIGIN_BOTTOM_LEFT: {
            tx = x + 10
            ty = y - 16
            x += 2
            y -= 2
            break
        }
        case ORIGIN_BOTTOM_CENTER: {
            tx = x + 10
            ty = y - 16
            x -= 1
            y -= 2
            break
        }
        case ORIGIN_BOTTOM_RIGHT: {
            tx = x - 36
            ty = y - 16
            x -= 2
            y -= 2
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            tx = x - 36
            ty = y - 16
            x -= 2
            y -= 1
            break
        }
        case ORIGIN_LEFT_CENTER: {
            tx = x + 10
            ty = y - 16
            x += 2
            y -= 1
            break
        }
    }
    if (style.zeroPoint) drawCircle(ctx, [x, y, 4], {})
    drawText(ctx, val, [tx, ty, 0], style)
}

export const drawMinXBoundaries = (ctx, minX, zero, origin, val, style) => {
    let x, y, t, tx, ty
    const {x: zx, y:zy} = zero

    x = zx
    y = zy

    switch (origin){
        case ORIGIN_CENTER_CENTER: {
            tx = x + minX
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_CENTER: {
            tx = x + minX
            ty = y + 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_RIGHT: {
            tx = x + minX
            ty = y + 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_CENTER: {
            tx = x + minX
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_RIGHT: {
            tx = x + minX
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            tx = x + minX * 2
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
    }
}

export const drawMaxXBoundaries = (ctx, maxX, zero, origin, val, style) => {
    let x, y, t, tx, ty, tw
    const {x: zx, y:zy} = zero

    x = zx
    y = zy

    tw = ctx.measureText(val).width

    switch (origin){
        case ORIGIN_CENTER_CENTER: {
            console.log(ctx.measureText(val).width)
            tx = x + maxX - 10 - tw
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_LEFT: {
            tx = x + maxX - 10 - tw
            ty = y + 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_CENTER: {
            tx = x + maxX - 10 - tw
            ty = y + 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_RIGHT: {
            tx = x + maxX
            ty = y + 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_LEFT: {
            tx = x + maxX - 10 - tw
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_CENTER: {
            tx = x + maxX - 10 - tw
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_RIGHT: {
            tx = x + maxX
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            tx = x + maxX * 2
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_LEFT_CENTER: {
            tx = x + maxX * 2 - 10 - tw
            ty = y - 16
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
    }
}

export const drawMinYBoundaries = (ctx, minY, zero, origin, val, style) => {
    let x, y, t, tx, ty
    const {x: zx, y:zy} = zero

    x = zx
    y = zy

    switch (origin){
        case ORIGIN_CENTER_CENTER: {
            tx = x + 10
            ty = y - minY - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_LEFT: {
            tx = x + 10
            ty = y - minY - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_CENTER: {
            tx = x + 10
            ty = y - minY * 2 - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_TOP_RIGHT: {
            tx = x - 46
            ty = y - minY - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            tx = x - 46
            ty = y - minY - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_LEFT_CENTER: {
            tx = x + 10
            ty = y - minY - 5
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
    }
}

export const drawMaxYBoundaries = (ctx, maxY, zero, origin, val, style) => {
    let x, y, t, tx, ty
    const {x: zx, y:zy} = zero

    x = zx
    y = zy

    switch (origin){
        case ORIGIN_CENTER_CENTER: {
            tx = x + 10
            ty = y - maxY + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_LEFT: {
            tx = x + 10
            ty = y - maxY + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_CENTER: {
            tx = x + 10
            ty = y - maxY * 2 + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_BOTTOM_RIGHT: {
            tx = x - 40
            ty = y - maxY + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_LEFT_CENTER: {
            tx = x + 10
            ty = y - maxY + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
        case ORIGIN_RIGHT_CENTER: {
            tx = x - 46
            ty = y - maxY + 10
            drawText(ctx, val, [tx, ty, 0], style)
            break
        }
    }
}