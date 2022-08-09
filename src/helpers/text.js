export const textWidth = (ctx, text, font = {}) => {
    const {style = 'normal', weight = 'normal', size = 12, lineHeight = 1, family = 'sans-serif'} = font

    ctx.save()
    ctx.beginPath()
    ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`

    const lines = text.toString().split('\n')
    let tw = 0
    for(let line of lines) {
        const _w = ctx.measureText(text).width
        if (_w > tw) tw = _w
    }
    ctx.closePath()
    ctx.restore()
    return tw
}

export const textHeight = (ctx, text) => {
    const lines = text.split("\n")
    const box = ctx.measureText(text)
    return (box.fontBoundingBoxAscent + box.fontBoundingBoxDescent) * lines.length
}

export const textBox = (ctx, text) => {
    const metrics = ctx.measureText( text );
    const left = metrics.actualBoundingBoxLeft * -1;
    const top = metrics.actualBoundingBoxAscent * -1;
    const right = metrics.actualBoundingBoxRight;
    const bottom = metrics.actualBoundingBoxDescent;
    const width = text.trim() === text ? right - left : metrics.width;
    const height = bottom - top;
    return { left, top, right, bottom, width, height };
}

export const getTextBoundingRect = (ctx, text) => {
    const width = textWidth(ctx, text)
    const height = textHeight(ctx, text)
    const box = textBox(ctx, text)

    return {
        top: box.top,
        left: box.left,
        right: box.right,
        bottom: box.bottom,
        width,
        height
    }
}