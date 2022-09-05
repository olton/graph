import {merge} from "../../helpers/merge.js";
import {defaultBarChartOptions} from "./default.js";
import {minMaxLinear} from "../../helpers/min-max.js";
import {isNumber} from "../../helpers/is-number.js";
import {drawRect} from "../../primitives/rect.js";
import {AxisY} from "../../mixins/axis-y.js";
import {Tooltip} from "../../mixins/tooltip.js";
import {hexToRGBA} from "../../helpers/colors.js";
import {drawText} from "../../primitives/text.js";
import {textWidth} from "../../helpers/text.js";
import {AxisX} from "../../mixins/axis-x.js";

/*
* Data can input as
* [
*     [value, name],
*     ...
*     [value, name],
* ]
* */

export class BarChart {
    constructor(data, options) {
        this.options = merge({}, defaultBarChartOptions, options)
        this.data = data
        this.maxX = 0
        this.minX = 0
        this.maxY = 0
        this.minY = 0
        this.groups = (data && data.length) || 0
        this.bars = []
        this.coords = []
        this.tooltip = null
        this.dataAxis = this.options.dataAxis.toLowerCase()

        for(let name in this.options.graphs) {
            this.bars.push([name, this.options.graphs[name]])
        }

        this.calcMinMax()
    }

    get [Symbol.toStringTag](){return "BarChart"}

    setSuperChart(chart){
        this.chart = chart
        this.dpi = chart.options.dpi
        this.ctx = chart.ctx
        this.canvas = chart.canvas
        this.padding = chart.padding
        this.fullWidth = chart.viewWidth
        this.fullHeight = chart.viewHeight
        this.width = chart.viewWidth - (chart.padding.left + chart.padding.right)
        this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom)
        this.top = chart.padding.top
        this.left = chart.padding.left
        this.proxy = chart.proxy

        if (this.options.rect !== 'default') {
            this.top = this.options.rect.top
            this.left = this.options.rect.left
            this.width = this.options.rect.width
            this.height = this.options.rect.height
        }

        this.calcRatio()
    }

    calcMinMax(){
        const o = this.options
        let a = []

        for (let k in this.data) {
            a = [].concat(a, this.data[k])
        }

        this.groups = this.data.length

        const [, max] = minMaxLinear(a)

        this.maxX = this.maxY = isNumber(o.boundaries.max) ? o.boundaries.max : max

        if (isNaN(this.maxY)) this.maxY = 100
        if (isNaN(this.maxX)) this.maxX = 100
    }

    calcRatio(){
        this.ratioX = this.ratioY = this.height / (this.maxY - this.minY)
    }

    drawBars(){

        if (!this.data || !this.data.length) return

        this.coords = []

        let bw = (this.width / 2) / this.groups
        let sp = (this.width / 2) / (this.groups + 1)
        let x = sp + this.left, y = this.top + this.height

        for (let i = 0; i < this.data.length; i++) {
            let h = this.data[i] * this.ratioY
            let name = this.bars[i][0]
            let color = hexToRGBA(this.bars[i][1], this.options.opacity)
            drawRect(this.ctx, [x, y - h, bw, h], {color, fill: color})
            this.coords.push([x, y - h, bw, h, [name, this.data[i]]])
            x += sp + bw
        }

    }

    drawLabels(){
        const labelStyle = this.options.labels.x

        for(let c of this.coords){
            let [x, y, bw, h, [name]] = c

            y += h

            this.ctx.save()

            let tx, ty

            if (labelStyle.text.angle >= 0) {
                labelStyle.text.angle = -45
            } else if (labelStyle.text.angle < -90) {
                labelStyle.text.angle = -90
            }

            if (labelStyle.text.angle) {
                const rx = x + bw/2 - Math.abs(labelStyle.text.angle/2) + labelStyle.shift.x
                const ry = y - labelStyle.font.size/2 + labelStyle.shift.y - 10

                this.ctx.translate(rx, ry)
                this.ctx.rotate(labelStyle.text.angle * Math.PI / 180)
                this.ctx.translate(-rx, -ry)

                tx = x + (labelStyle.text.angle === 90 || labelStyle.text.angle === -90 ? -20 : 20)
                ty = y + labelStyle.font.size
                labelStyle.text.align = 'right'
            } else {
                tx = x + bw/2 - textWidth(this.ctx, name, labelStyle.font)/2
                ty = y + labelStyle.font.size
                labelStyle.text.align = 'left'
            }

            drawText(
                this.ctx,
                `${name}`, [tx, ty, 0],
                labelStyle.text,
                labelStyle.font
            )

            this.ctx.restore()
        }
    }

    drawLegend(){}

    drawTooltip(){
        const ctx = this.ctx
        const rect = this.canvas.getBoundingClientRect()
        let tooltip = false

        if (!this.data || !this.data.length) return
        if (!this.proxy.mouse) return

        let {x: mx, y: my} = this.proxy.mouse
        let [_mx, _my] = [mx, my]

        mx = (mx - rect.left) * this.dpi
        my = (my - rect.top) * this.dpi

        for(let coordinates of this.coords) {
            let [x, y, w, h, [n, v]] = coordinates

            const lx = x, rx = x + w
            const ly = y, ry = y + h

            if ((mx > lx && mx < rx) && (my > ly && my < ry)) {
                const color = hexToRGBA(this.options.graphs[n], 1)
                drawRect(this.ctx, [x, y, w, h], {color, fill: color})

                this.showTooltip(ctx, [_mx, _my], [n, v])
                tooltip = true
            }
        }

        if (!tooltip && this.tooltip) {
            this.removeTooltip()
        }
    }

    drawLabelY(){}
    drawLabelX(){}
    showTooltip(){}
    removeTooltip(){}

    draw(){
        this.drawLabelY()
        this.drawBars()
        this.drawLegend()
        this.drawTooltip()
        this.drawLabels()
    }
}

Object.assign(BarChart.prototype, AxisY, AxisX, Tooltip)