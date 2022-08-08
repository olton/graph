import {merge} from "../../helpers/merge.js";
import {line} from "../../primitives/line.js";
import {curve} from "../../primitives/curve.js";
import {circle} from "../../primitives/circle.js";
import {square} from "../../primitives/square.js";
import {triangle} from "../../primitives/triangle.js";
import {diamond} from "../../primitives/diamond.js";
import {dot} from "../../primitives/dot.js";
import {text} from "../../primitives/text.js";
import {defaultPointChartOptions} from "./default.js";
import {
    toOrigin
} from "../../mixins/axis.js";
import {defaultDotStyle, defaultLineStyle} from "../../defaults/index.js";
import {
    drawMaxXBoundaries, drawMaxYBoundaries,
    drawMinXBoundaries,
    drawMinYBoundaries,
    drawZeroBoundaries
} from "../../mixins/boundaries.js";
import {randomColor} from "../../helpers/random-color.js";

const dotFunc = {
    circle,
    square,
    triangle,
    diamond,
    dot
}

const lineFunc = {
    line,
    curve
}

export class PointChart {
    constructor(data, options) {
        this.data = [...data]
        this.options = merge({}, defaultPointChartOptions, options)
        this.canvas = null
        this.graphs = []
        this.coords = []

        const that = this

        this.data.forEach((data, index) => {
            if (that.options.graphs[index]) {
                const dot = merge({}, defaultDotStyle, that.options.dot, that.options.graphs[index].dot)
                const line = merge({}, defaultLineStyle, that.options.line, that.options.graphs[index].line)
                that.graphs.push(merge({}, defaultPointChartOptions, {dot, line}))
            } else {
                that.graphs.push(merge({}, defaultPointChartOptions, {dot: that.options.dot, line: that.options.line}))
            }
        })

        this.calcMinMax()
    }

    get [Symbol.toStringTag](){return "PointChart"}

    setSuperChart(chart){
        this.chart = chart
        this.padding = chart.padding
        this.fullWidth = chart.viewWidth
        this.fullHeight = chart.viewHeight
        this.width = chart.viewWidth - (chart.padding.left + chart.padding.right)
        this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom)
        this.origin = chart.options.axis.origin
        this.zero = chart.zero
        this.dpi = chart.options.dpi

        this.calcRatio()
    }

    calcMinMax(){
        let minX = this.options.boundaries.min.x,
            maxX = this.options.boundaries.max.x
        let minY = this.options.boundaries.min.y,
            maxY = this.options.boundaries.max.y

        const inc = this.options.boundaries.increment / 100

        this.minX = minX + minX * inc
        this.maxX = maxX + maxX * inc
        this.minY = minY + minY * inc
        this.maxY = maxY + maxY * inc
    }

    calcRatio(){
        const a = ["top-left", "top-right", "bottom-left", "bottom-right"]
        const mod = a.includes(this.origin) ? 2 : 1

        this.ratioX = this.width / (this.maxX - this.minX) * mod
        this.ratioY = this.height / (this.maxY - this.minY) * mod
    }

    add(index, [x, y]){
        const o = this.options
        const maxSize = o.maxGraphSize

        if (maxSize) {
            while (this.data[index].length > maxSize - 1) {
                this.data[index].shift()
            }
        }

        this.data[index].push([x, y])

        this.chart.resize()
    }

    #inView(x, y){
        const {left, top} = this.padding
        const minX = left - 1
        const maxX = left + this.width + 1
        const minY = top - 1
        const maxY = top + this.height + 1

        return (x >= minX && x <= maxX) && (y >= minY && y <= maxY)
    }

    drawBoundaries(){
        const {zero, minX, maxX, minY, maxY, style, zeroPoint} = this.options.boundariesValues

        if (zero) {
            const text = `${(this.minX+this.maxX)/2}, ${(this.minY+this.maxY)/2}`
            drawZeroBoundaries(this.chart.ctx, this.zero, this.origin, text, {...style, zeroPoint })
        }
        if (minX) {
            const text = `${this.minX}`
            drawMinXBoundaries(this.chart.ctx, this.minX * this.ratioX, this.zero, this.origin, text, style)
        }
        if (maxX) {
            const text = `${this.maxX}`
            drawMaxXBoundaries(this.chart.ctx, this.maxX * this.ratioX, this.zero, this.origin, text, style)
        }
        if (minY) {
            const text = `${this.minY}`
            drawMinYBoundaries(this.chart.ctx, this.minY * this.ratioY, this.zero, this.origin, text, style)
        }
        if (maxY) {
            const text = `${this.maxY}`
            drawMaxYBoundaries(this.chart.ctx, this.maxY * this.ratioY, this.zero, this.origin, text, style)
        }
    }

    drawGraph(){
        if (!this.data || !this.data.length) return

        const coords = [], include = []
        let index = 0
        const that = this
        const ctx = this.chart.ctx
        const dpi = this.chart.dpi
        const o = this.options

        for(let data of this.data) {
            const graphStyle = this.graphs[index]
            const dotStyle = graphStyle.dot
            const dotColor = dotStyle.color
            const lineStyle = graphStyle.line

            for(let i = 0; i < data.length; i++) {
                let [x, y] = data[i]
                let _x, _y

                _x = Math.round((this.origin ? x : x - this.minX) * this.ratioX)
                _y = Math.round((this.origin ? y : y - this.minY) * this.ratioY)

                if (this.origin) {
                    [_x, _y] = toOrigin(_x, _y, this.chart.zero)
                }

                coords.push([_x, _y, x, y])

                if (this.#inView(_x, _y)) {
                    include.push([_x, _y, x, y])
                }
            }

            if (o.lines) {
                lineFunc[lineStyle.type](ctx, include, lineStyle)
            }

            if (o.dots) {
                for(let [_x, _y, x, y] of include) {
                    if (dotStyle.color === 'random') {
                        dotStyle.color = randomColor()
                    }
                    dotFunc[dotStyle.type](ctx, [_x, _y, dotStyle.size], dotStyle)
                    if (o.values && o.values.show) {
                        const val = o.values.template.replace('x', x).replace('y', y)
                        text(ctx, `${val}`, [_x + o.values.translate[0] * dpi, _y + o.values.translate[1] * dpi, 0], o.values)
                    }
                }
            }

            this.coords[index] = coords

            index++
        }
    }

    draw(){
        this.drawBoundaries()
        this.drawGraph()
    }
}

export const pointChart = (...args) => new PointChart(...args)