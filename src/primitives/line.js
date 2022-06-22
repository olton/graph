export const line = (ctx, from, to, style = {color: '#000', size: 1, dash: []}) => {
    const {color, size, dash} = style

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