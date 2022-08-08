/**
 *
 * @param ctx
 * @param x
 * @param y
 * @param radius
 * @param {Number} startAngle in Radians
 * @param {Number} endAngle in Radians
 * @param {Object} style {color = '#000', fill = '#fff', size = 1, dash = []}
 */
export const drawSector = (ctx, [x, y, radius = 4, startAngle, endAngle], style = {}) => {
    const {color = '#000', fill = '#fff', size = 1, dash = []} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.fillStyle = fill

    ctx.arc(x, y, radius , startAngle, endAngle)
    ctx.lineTo(x, y)

    ctx.fill()
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
}