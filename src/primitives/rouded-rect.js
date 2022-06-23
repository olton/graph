import {isObject} from "../helpers/is-object.js";

export const roundedRect = (ctx, [x, y, width, height, radius = 0], style = {}) => {
    const {color = '#000', fill = '#fff', size = 1, dash = []} = style

    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius}
    } else if (isObject(radius)) {
        const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0}
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side]
        }
    } else {
        radius = {tl: 0, tr: 0, br: 0, bl: 0}
    }

    ctx.beginPath();
    ctx.fillStyle = fill
    ctx.strokeStyle = color
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
}