import {
    ORIGIN_BOTTOM_CENTER,
    ORIGIN_BOTTOM_LEFT,
    ORIGIN_BOTTOM_RIGHT,
    ORIGIN_CENTER_CENTER, ORIGIN_LEFT_CENTER, ORIGIN_RIGHT_CENTER, ORIGIN_TOP_CENTER, ORIGIN_TOP_LEFT, ORIGIN_TOP_RIGHT
} from "../../mixins/axis.js";
import {merge} from "../../helpers/merge.js";
import {line} from "../../primitives/line.js";
import {curve} from "../../primitives/curve.js";
import {circle} from "../../primitives/circle.js";
import {square} from "../../primitives/square.js";
import {triangle} from "../../primitives/triangle.js";
import {diamond} from "../../primitives/diamond.js";
import {text} from "../../primitives/text.js";
import {defaultLineChartOptions} from "./default.js";

const dotFunc = {
    circle,
    square,
    triangle,
    diamond
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

        this.data.forEach((data, index) => {
            if (this.options.graphs[index]) {
                this.graphs.push(this.options.graphs[index])
            } else {
                this.graphs.push({
                    dot: this.options.dot,
                    line: this.options.line
                })
            }
        })

        this.calcMinMax()
    }

    get [Symbol.toStringTag](){return "LineChart"}

    setSuperChart(chart){
        this.chart = chart
        this.width = chart.viewWidth
        this.height = chart.viewHeight

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
                let _x, _y, _mx, _my

                _x = x * this.ratioX
                _y = y * this.ratioY

                if (o.origin) {
                    switch (this.chart.options.axis.origin) {
                        case ORIGIN_BOTTOM_CENTER: {
                            _x = this.width / 2 + _x
                            _y = this.height - _y
                            break
                        }
                        case ORIGIN_BOTTOM_RIGHT: {
                            _x = this.width + _x
                            _y = this.height - _y
                            break
                        }
                        case ORIGIN_LEFT_CENTER: {
                            _y = this.height / 2 - _y
                            break
                        }
                        case ORIGIN_RIGHT_CENTER: {
                            _x = this.width + _x
                            _y = this.height / 2 - _y
                            break
                        }
                        case ORIGIN_TOP_CENTER: {
                            _x = this.width / 2 + _x
                            _y = - _y
                            break
                        }
                        case ORIGIN_CENTER_CENTER: {
                            _x = this.width / 2 + _x
                            _y = this.height / 2 - _y
                            break
                        }
                        case ORIGIN_TOP_RIGHT: {
                            _x = this.width + _x
                            _y = - _y
                            break
                        }
                        case ORIGIN_TOP_LEFT: {
                            _y =  - _y
                            break
                        }
                        case ORIGIN_BOTTOM_LEFT: {
                            _y = this.height - _y
                            break
                        }
                    }
                }

                coords.push([_x, _y])

                dotFunc[dotStyle.type](ctx, [_x, _y, 10], dotStyle)

                if (o.values.show) {
                    const val = o.values.template.replace('x', x).replace('y', y)
                    text(ctx, `${val}`, [_x + o.values.shift.x * dpi, _y + o.values.shift.y * dpi], o.values)
                }
            }
            index++

            if (o.lines) {
                lineFunc[lineStyle.type](ctx, coords, lineStyle)
            }
        }
    }
}

export const lineChart = (...args) => new LineChart(...args)