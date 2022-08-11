import {drawDot} from "../primitives/dot.js";
import {textHeight, textWidth} from "../helpers/text.js";
import {drawText} from "../primitives/text.js";
import {drawVector} from "../primitives/vector.js";

export const AxisY = {
    drawLabelY(){
        const o = this.options
        const labelStyle = o.labels.y
        let labelStep = 0

        if (labelStyle.step === 'auto') {
            if (labelStyle.count) {
                labelStep = (this.maxY - this.minY) / labelStyle.count
            }
        } else {
            labelStep = (this.maxY - this.minY) / labelStyle.step
        }

        if (!labelStep) return

        const _drawReferencePoint = (x, y) => {
            if (labelStyle.line && labelStyle.referencePoint) {
                drawDot(this.ctx, [x, y, 4], labelStyle.line)
            }
        }

        const _drawLabelValue = (val, x, y) => {
            if (labelStyle.showValue) {
                const vw = textWidth(this.ctx, val, labelStyle.font)
                const vh = textHeight(this.ctx, val, labelStyle.font)
                const tx = x - vw - labelStyle.font.size/2 + labelStyle.shift.x
                const ty = y + labelStyle.shift.y

                this.ctx.save()

                if (labelStyle.text.angle) {
                    const rx = x + vw/2 - Math.abs(labelStyle.text.angle/2) + labelStyle.shift.x, ry = y - labelStyle.font.size/2 + vw + labelStyle.shift.y
                    this.ctx.translate(rx, ry)
                    this.ctx.rotate(labelStyle.text.angle * Math.PI / 180)
                    this.ctx.translate(-rx, -ry)
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
                if (i === this.minY && labelStyle.skipFirst) { // TODO add skip last
                } else {
                    const from = {x, y}
                    const to = {x: x + this.width, y}
                    drawVector(this.ctx, from, to, labelStyle.line) // line
                }
            }
        }

        if (labelStyle.step === 'auto') {
            let labelValue = this.minY
            let x = this.padding.left, vy = this.padding.top + this.height, lx = this.padding.left + this.width

            for (let i = 0; i <= labelStyle.count; i++) {
                _drawLine(i, x, vy)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelY(labelValue), x, vy)
                labelValue += labelStep
                vy = (this.padding.top + this.height) - (labelValue - this.minY) * this.ratioY
            }
        } else {
            let x = this.padding.left, vy = this.padding.top + this.height

            let i = this.minY
            while (i < this.maxY + 1) {
                _drawLine(i, x, vy)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelY(i), x, vy)
                i += labelStep
                vy -= labelStep * this.ratioY
            }
        }
    }
}