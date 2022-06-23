export const vector = (ctx, from, to, style = {}) => {
    const {color = '#000', size = 1, dash = []} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color

    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)

    ctx.stroke()
    ctx.restore()
    ctx.closePath()
}