export const diamond = (ctx, [x, y, r], style = {}) => {
    const {color = '#000', fill = '#fff', size = 1, dash = []} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.fillStyle = fill

    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.lineTo(x, y - r);

    ctx.fill()
    ctx.stroke()
    ctx.restore()
    ctx.closePath()
}