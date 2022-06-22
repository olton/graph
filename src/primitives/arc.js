export const arc = (ctx, [x, y, r = 10, sa = 0, ea = 2], style = {color: '#000', size: 1, dash: []}) => {
    const {color, size, dash} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color

    ctx.arc(x, y, r, sa, ea * Math.PI)

    ctx.stroke()
    ctx.restore()
    ctx.closePath()
}