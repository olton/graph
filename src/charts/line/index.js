import {merge} from "../../helpers/merge.js";
import {line} from "../../primitives/line.js";
import {curve} from "../../primitives/curve.js";
import {circle} from "../../primitives/circle.js";
import {square} from "../../primitives/square.js";
import {triangle} from "../../primitives/triangle.js";
import {diamond} from "../../primitives/diamond.js";
import {dot} from "../../primitives/dot.js";
import {text} from "../../primitives/text.js";
import {defaultLineChartGraph, defaultLineChartOptions} from "./default.js";
import {toOrigin} from "../../mixins/axis.js";
import {defaultDotStyle, defaultLineStyle} from "../../defaults/index.js";

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

export class LineChart {
    constructor(data, options) {
        this.data = [...data]
        this.options = merge({}, defaultLineChartOptions, options)
        this.canvas = null
        this.graphs = []
        this.coords = []

        const that = this

        this.data.forEach((data, index) => {
            if (that.options.graphs[index]) {
                const dot = merge({}, defaultDotStyle, that.options.dot, that.options.graphs[index].dot)
                const line = merge({}, defaultLineStyle, that.options.line, that.options.graphs[index].line)
                that.graphs.push(merge({}, defaultLineChartGraph, {dot, line}))
            } else {
                that.graphs.push(merge({}, defaultLineChartGraph, {dot: that.options.dot, line: that.options.line}))
            }
        })

        this.calcMinMax()
    }

    get [Symbol.toStringTag](){return "LineChart"}

    setSuperChart(chart){
        this.chart = chart
        this.padding = chart.padding
        this.fullWidth = chart.viewWidth
        this.fullHeight = chart.viewHeight
        this.width = chart.viewWidth - (chart.padding.left + chart.padding.right)
        this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom)
        this.origin = chart.options.axis.origin

        this.calcRatio()
    }

    calcMinMax(){
        if (!this.data || !this.data.length) return

        let minX = this.options.boundaries.min.x,
            maxX = this.options.boundaries.max.x
        let minY = this.options.boundaries.min.y,
            maxY = this.options.boundaries.max.y

        for(let lineData of this.data) {
            for(let point of lineData) {
                const [x, y] = point
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
            }
        }

        const inc = this.options.boundaries.increment / 100

        this.minX = minX + minX * inc
        this.maxX = maxX + maxX * inc
        this.minY = minY + minY * inc
        this.maxY = maxY + maxY * inc
    }

    calcRatio(){
        this.ratioX = this.width / (this.maxX - this.minX)
        this.ratioY = this.height / (this.maxY - this.minY)
    }

    add(index, [x, y], updateMinMax = true){
        const o = this.options
        const maxSize = o.maxGraphSize

        if (maxSize) {
            while (this.data[index].length > maxSize) {
                this.data[index].shift()
            }
        }

        this.data[index].push([x, y])

        if (updateMinMax) {
            this.minX = this.data[index][0][0]
            this.maxX = x

            if (y > this.maxY) this.maxY = y + this.options.boundaries.increment / 100
            if (y < this.minY) this.minY = y - this.options.boundaries.increment / 100

            this.calcRatio()
        }

        this.chart.resize()
    }

    #inView(x, y){
        const {left, top} = this.padding
        const minX = left + 0
        const maxX = left + this.width - 0
        const minY = top + 0
        const maxY = top + this.height - 0

        return (x >= minX && x <= maxX) && (y >= minY && y <= maxY)
    }

    draw(){
        if (!this.data || !this.data.length) return

        const coords = []
        let index = 0
        const ctx = this.chart.ctx
        const dpi = this.chart.dpi
        const o = this.options

        for(let data of this.data) {
            const graphStyle = this.graphs[index]
            const dotStyle = graphStyle.dot
            const lineStyle = graphStyle.line

            for(let i = 0; i < data.length; i++) {
                let [x, y] = data[i]
                let _x, _y

                _x = Math.round((o.origin ? x : x - this.minX) * this.ratioX)
                _y = Math.round((o.origin ? y : y - this.minY) * this.ratioY)

                if (o.origin) {
                    [_x, _y] = toOrigin(_x, _y, this.chart.zero)
                }

                if (this.#inView(_x, _y)) {
                    coords.push([_x, _y, x, y])
                }
            }

            if (o.lines) {
                lineFunc[lineStyle.type](ctx, coords, lineStyle)
            }

            if (o.dots) {
                for(let [_x, _y, x, y] of coords) {
                    dotFunc[dotStyle.type](ctx, [_x, _y, dotStyle.size], dotStyle)

                    if (o.values && o.values.show) {
                        const val = o.values.template.replace('x', x).replace('y', y)
                        text(ctx, `${val}`, [_x + o.values.shift.x * dpi, _y + o.values.shift.y * dpi], o.values)
                    }
                }
            }

            this.coords[index] = coords

            index++
        }
    }
}

export const lineChart = (...args) => new LineChart(...args)