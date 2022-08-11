import {textWidth} from "../helpers/text.js";

export const drawText = (ctx, text, [x = 0, y = 0, w = 0], textStyle = {}, font = {}, box = {}) => {
    const {align = 'left', baseLine = 'middle', color = '#000', stroke = '#000'} = textStyle
    const {style = 'normal', weight = 'normal', size = 12, lineHeight = 1, family = 'sans-serif'} = font
    const {color: boxColor = '#000'} = box
    let tw = 0, tx = 0, ty = 0, th = 0

    tw = textWidth(ctx, text, font)

    ctx.save()
    ctx.beginPath()

    ctx.textAlign = align
    ctx.fillStyle = color
    ctx.strokeStyle = stroke
    ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`
    ctx.textBaseline = baseLine

    text.split("\n").map( (str, i) => {
        ctx.fillText(str, x, y + (i * lineHeight * font.size), w || tw)
    })

    ctx.closePath()
    ctx.restore()
}