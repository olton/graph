export const drawCandle = (ctx, [x, y, h, by, bw, bh, leg = false], style = {}) => {
    const {color = 'red', size = 1, dash = []} = style

    ctx.beginPath()
    ctx.save()
    ctx.setLineDash(dash)
    ctx.lineWidth = size
    ctx.strokeStyle = color
    ctx.fillStyle = color

    ctx.moveTo(x, y)
    ctx.lineTo(x, y + h)

    if (leg) {
        ctx.moveTo(x - bw / 2, y)
        ctx.lineTo(x + bw / 2, y)

        ctx.moveTo(x - bw / 2, y + h)
        ctx.lineTo(x + bw / 2, y + h)
    }

    ctx.rect(x - bw / 2, by, bw, bh)

    ctx.stroke()
    ctx.fill()
    ctx.restore()
    ctx.closePath()
}