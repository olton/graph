import {textWidth} from "../helpers/text-width.js";

export const drawText = (ctx, text, [x = 0, y = 0, w = 0], textStyle = {}) => {
    const {align = 'left', baseLine = 'middle', color = '#000', stroke = '#000', font = {}, angle = 0, translate = [0,0], dpi = 1} = textStyle
    const {style = 'normal', weight = 'normal', size = 12, lineHeight = 1, family = 'sans-serif'} = font
    let tw = 0

    let tX = 0, tY = 0

    if (typeof translate === "number") {
        tX = tY = translate
    } else if (Array.isArray(translate)) {
        [tX, tY] = translate
    }

    ctx.save()
    ctx.beginPath()
    ctx.textAlign = align
    ctx.fillStyle = color
    ctx.strokeStyle = stroke
    ctx.font = `${style} ${weight} ${size*dpi}px/${lineHeight} ${family}`
    ctx.translate(tX, tY)
    ctx.rotate(angle * Math.PI / 180)
    ctx.textBaseline = baseLine

    tw = textWidth(ctx, text)

    text.split("\n").map( (str, i) => {
        ctx.fillText(str, x, y + (i * lineHeight * font.size), w || tw)
    })

    ctx.closePath()
    ctx.restore()
}