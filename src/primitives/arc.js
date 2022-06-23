/**
 *
 * @param ctx Canvas context
 * @param x Center X
 * @param y Center Y
 * @param r Radius
 * @param sa StartAngle in Radians
 * @param ea EndAngle in Radians
 * @param {Object} style
 */
export const arc = (ctx, [x, y, r = 10, sa = 0, ea = 2 * Math.PI], style = {}) => {
    const {fill = '#000', color = '#000', size = 1, dash = []} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.fillStyle = fill

    ctx.arc(x, y, r, sa, ea)

    ctx.stroke()
    ctx.fill()
    ctx.restore()
    ctx.closePath()
}