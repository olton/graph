export const triangle = (ctx, [x, y, r], style = {}) => {
    const {color = '#000', fill = '#fff', size = 1} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash([])
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.fillStyle = fill

    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x - r, y + r);
    ctx.lineTo(x, y - r);

    ctx.fill()
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
}