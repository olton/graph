import {drawDot} from "../primitives/dot.js";
import {textHeight, textWidth} from "../helpers/text.js";
import {drawText} from "../primitives/text.js";
import {drawVector} from "../primitives/vector.js";

export const AxisX = {
    drawLabelX(){
        const o = this.options
        const labelStyle = o.labels.x
        let labelStep = 0

        if (labelStyle.step === 'auto') {
            if (labelStyle.count) {
                labelStep = (this.maxX - this.minX) / labelStyle.count
            }
        } else {
            labelStep = (this.maxX - this.minX) / labelStyle.step
        }

        if (!labelStep) return

        const _drawReferencePoint = (x, y) => {
            if (labelStyle.line && labelStyle.referencePoint) {
                drawDot(this.ctx, [x, y, 4], labelStyle.line)
            }
        }

        const _drawLabelValue = (val, x, y) => {
            if (labelStyle.showValue) {
                const vw = textWidth(this.ctx, ""+val, labelStyle.font)
                const vh = textHeight(this.ctx, ""+val, labelStyle.font)
                const tx = x - vw / 2 + labelStyle.shift.x
                const ty = y + vh + labelStyle.font.size/2 + labelStyle.shift.y

                this.ctx.save()

                if (labelStyle.text.angle) {
                    const rx = x + vw/2 - Math.abs(labelStyle.text.angle/2) + labelStyle.shift.x, ry = y - labelStyle.font.size/2 + vw + labelStyle.shift.y
                    this.ctx.translate(rx, ry)
                    this.ctx.rotate(labelStyle.text.angle * Math.PI / 180)
                    this.ctx.translate(-rx + 100, -ry)
                }

                drawText(
                    this.ctx,
                    `${val}`, [tx, ty, 0],
                    labelStyle.text,
                    labelStyle.font
                )

                this.ctx.restore()
            }
        }

        const _drawLine = (i, x, y) => {
            if (labelStyle.line) {
                if (i === this.minX && labelStyle.skipFirst) { // TODO add skip last
                } else {
                    const from = {x, y}
                    const to = {x, y: y + this.height}
                    drawVector(this.ctx, from, to, labelStyle.line) // line
                }
            }
        }

        if (labelStyle.step === 'auto') {
            let labelValue = this.minX
            let x = this.padding.left, vy = this.padding.top + this.height, ly = this.padding.top

            for (let i = 0; i <= labelStyle.count; i++) {
                _drawLine(i, x, ly)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelX(labelValue), x, vy)
                labelValue += labelStep
                x = (this.padding.left) + (labelValue - this.minX) * this.ratioX
                console.log(x, this.width + this.padding.left)
            }
        } else {
            let x = this.padding.left, vy = this.padding.top + this.height, ly = this.padding.top

            let i = this.minX

            while (i < this.maxX + 1) {
                _drawLine(i, x, ly)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelX(i), x, vy)

                i += labelStep
                x += labelStep * this.ratioX
            }
        }
    }
}