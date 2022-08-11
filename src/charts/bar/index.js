import {merge} from "../../helpers/merge.js";
import {defaultBarChartOptions} from "./default.js";
import {minMaxLinear} from "../../helpers/min-max.js";
import {isNumber} from "../../helpers/is-number.js";
import {drawRect} from "../../primitives/rect.js";
import {AxisY} from "../../mixins/axis-y.js";
import {Tooltip} from "../../mixins/tooltip.js";
import {hexToRGBA} from "../../helpers/colors.js";

/*
* Data can input as
* [
*     [value, name],
*     ...
*     [value, name],
* ]
* or
* [
*     [
*         [value, name],
*         ...
*         [value, name],
*     ],
*     ...
*     [
*         [value, name],
*         ...
*         [value, name],
*     ],
* ]
* */

export class BarChart {
    constructor(data, options) {
        this.options = merge({}, defaultBarChartOptions, options)
        this.data = data
        this.maxY = 0
        this.minY = 0
        this.grouped = data && Array.isArray(data[0])
        this.groups = (data && data.length) || 0
        this.bars = []
        this.coords = []
        this.tooltip = null

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
        this.proxy = chart.proxy

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

        this.maxY = isNumber(o.boundaries.max.y) ? o.boundaries.max.y : max

        if (isNaN(this.maxY)) this.maxY = 100
    }

    calcRatio(){
        this.ratioY = this.height / (this.maxY - this.minY)
    }

    drawBars(){
        if (!this.data || !this.data.length) return

        this.coords = []

        if (this.grouped) {

        } else {
            let bw = (this.width / 2) / this.groups
            let sp = (this.width / 2) / (this.groups + 1)
            let x = sp + this.padding.left, y = this.padding.top + this.height

            for (let i = 0; i < this.data.length; i++) {
                let h = this.data[i] * this.ratioY
                let color = hexToRGBA(this.bars[i][1], this.options.opacity)
                drawRect(this.ctx, [x, y - h, bw, h], {color, fill: color})
                this.coords.push([x, y - h, bw, h, [this.bars[i][0], this.data[i]]])
                x += sp + bw
            }
        }
    }

    drawLabelX(){

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
    showTooltip(){}
    removeTooltip(){}

    draw(){
        this.drawLabelX()
        this.drawLabelY()
        this.drawBars()
        this.drawLegend()
        this.drawTooltip()
    }
}

Object.assign(BarChart.prototype, AxisY, Tooltip)