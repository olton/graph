import {drawCircle} from "../../primitives/circle.js";
import {drawSquare} from "../../primitives/square.js";
import {drawTriangle} from "../../primitives/triangle.js";
import {drawDiamond} from "../../primitives/diamond.js";
import {drawDot} from "../../primitives/dot.js";
import {drawLine} from "../../primitives/line.js";
import {drawCurve} from "../../primitives/curve.js";
import {drawArea} from "../../primitives/area.js";
import {drawText} from "../../primitives/text.js";
import {merge} from "../../helpers/merge.js";
import {defaultLineChartOptions} from "./default.js";
import {
    defaultDotStyle,
    defaultFontStyle,
    defaultLineStyle,
    defaultTextStyle,
    TEXT_BOTTOM, TEXT_TOP
} from "../../defaults/index.js";
import {defaultLineChartGraph} from "../../defaults/index.js";
import {
    ORIGIN_BOTTOM_LEFT,
    ORIGIN_BOTTOM_RIGHT,
    ORIGIN_TOP_LEFT,
    ORIGIN_TOP_RIGHT
} from "../../mixins/axis.js";
import {randomColor} from "../../helpers/random-color.js";
import {textHeight, textWidth} from "../../helpers/text.js";
import {normPadding} from "../../helpers/padding.js";
import {capitalize} from "../../helpers/capitalize.js";
import {drawVector} from "../../primitives/vector.js";
import {minMax} from "../../helpers/min-max.js";
import {isNumber} from "../../helpers/is-number.js";
import {AxisY} from "../../mixins/axis-y.js";
import {AxisX} from "../../mixins/axis-x.js";
import {Tooltip} from "../../mixins/tooltip.js";

const dotFunc = {
    drawCircle,
    drawSquare,
    drawTriangle,
    drawDiamond,
    drawDot
}

const lineFunc = {
    drawLine,
    drawCurve
}

export class LineChart {
    constructor(data, options) {
        this.data = [...data]
        this.options = merge({}, defaultLineChartOptions, options)
        this.canvas = null
        this.graphs = []
        this.graphsNames = []
        this.hiddenGraphs = []
        this.coords = []
        this.tooltip = null
        this.minX = null
        this.maxX = null
        this.minY = null
        this.maxY = null
        this.title = this.options.title

        const that = this

        const o = this.options

        const usedColors = []
        let color, graphName
        this.data.forEach((data, index) => {
            if (o.graphs[index]) {
                const dot = merge({}, defaultDotStyle, o.dot, o.graphs[index].dot)
                const line = merge({}, defaultLineStyle, o.line, o.graphs[index].line)
                that.graphs.push(merge({}, defaultLineChartGraph, {dot, line}))
                graphName = o.graphs[index].name || `line${index+1}`
            } else {
                graphName = `line${index+1}`
                if (index === 0) {
                    that.graphs.push(merge({}, defaultLineChartGraph, {dot: o.dot, line: o.line}))
                } else {
                    do {
                        color = randomColor()
                    } while (usedColors.includes(color))
                    that.graphs.push(merge({}, defaultLineChartGraph, {dot: {...o.dot, color}, line: {...o.line, color}}))
                    usedColors.push(color)
                }
            }
            that.graphsNames.push(graphName)
        })

        console.log(this.graphs)

        this.calcMinMax()
    }

    get [Symbol.toStringTag](){return "LineChart"}

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
        this.origin = chart.options.axis.origin
        this.zero = chart.zero
        this.proxy = chart.proxy

        switch (this.origin){
            case ORIGIN_TOP_LEFT: {
                this.zero = [this.padding.left, this.padding.top]
                break
            }
            case ORIGIN_TOP_RIGHT: {
                this.zero = [this.width + this.padding.left, this.padding.top]
                break
            }
            case ORIGIN_BOTTOM_RIGHT: {
                this.zero = [this.width + this.padding.left, this.height + this.padding.top]
                break
            }
            // bottom-left
            default : {
                this.zero = [this.padding.left, this.height + this.padding.top]
                break
            }
        }

        this.calcRatio()
    }

    calcMinMax(){
        const o = this.options
        let a = []

        for (let d of this.data) {
            if (!Array.isArray(d)) continue
            for( const [x, y] of d) {
                a.push([x, y])
            }
        }

        const [minX, maxX] = minMax(a, 'x');
        const [minY, maxY] = minMax(a, 'y');

        this.minX = isNumber(o.boundaries.min.x) ? o.boundaries.min.x : minX
        this.maxX = isNumber(o.boundaries.max.x) ? o.boundaries.max.x : maxX
        this.minY = isNumber(o.boundaries.min.y) ? o.boundaries.min.y : minY
        this.maxY = isNumber(o.boundaries.max.y) ? o.boundaries.max.y : maxY

        if (isNaN(this.minX)) this.minX = 0
        if (isNaN(this.maxX)) this.maxX = 100
        if (isNaN(this.minY)) this.minX = 0
        if (isNaN(this.maxY)) this.maxX = 100
    }

    calcRatio(){
        this.ratioX = this.width / (this.maxX - this.minX)
        this.ratioY = this.height / (this.maxY - this.minY)
        // console.log(this.ratioX, this.ratioY)
    }

    #inView(x, y){
        const {left, top} = this.padding
        const minX = left - 1
        const maxX = left + this.width + 1
        const minY = top - 1
        const maxY = top + this.height + 1

        return (x >= minX && x <= maxX) && (y >= minY && y <= maxY)
    }

    add(index, [x, y], shift = true){
        const o = this.options
        const maxSize = o.maxGraphSize

        if (maxSize) {
            while (this.data[index].length > maxSize - 1) {
                this.data[index].shift()
            }
        }

        this.data[index].push([x, y])

        this.minX = this.data[index][0][0]
        this.maxX = x

        if (this.maxY < y) {
            this.maxY = y + y * (this.options.boundaries.increment / 100)
        }

        this.calcRatio()

        this.chart.resize()
    }

    hide(index){
        if (this.hiddenGraphs.includes(index)) {
            let idx = this.hiddenGraphs.indexOf(index);
            if (idx !== -1) {
                this.hiddenGraphs.splice(idx, 1);
            }
        } else {
            this.hiddenGraphs.push(index)
        }
    }

    #toOrigin(x, y){
        const [zx, zy] = this.zero
        let _x, _y
        if (this.origin === ORIGIN_TOP_RIGHT) {
            _x = zx - Math.round((x - this.minX) * this.ratioX)
            _y = zy + Math.round((y - this.minY) * this.ratioY)
        }
        else if (this.origin === ORIGIN_TOP_LEFT) {
            _x = Math.round((x - this.minX) * this.ratioX) + zx
            _y = Math.round((y - this.minY) * this.ratioY) + zy
        }
        else if (this.origin === ORIGIN_BOTTOM_RIGHT) {
            _x = zx - Math.round((x - this.minX) * this.ratioX)
            _y = zy - Math.round((y - this.minY) * this.ratioY)
        }
        else if (this.origin === ORIGIN_BOTTOM_LEFT) {
            _x = Math.round((x - this.minX) * this.ratioX) + zx
            _y = zy - Math.round((y - this.minY) * this.ratioY)
        }
        return [_x, _y]
    }

    drawGraph(){
        if (!this.data || !this.data.length) return

        const include = []
        const ctx = this.ctx
        const o = this.options
        const [zx, zy] = this.zero

        let index = 0
        for(let data of this.data) {
            if (this.hiddenGraphs.includes(index)) continue

            const graphStyle = this.graphs[index]
            const dotStyle = graphStyle.dot
            const lineStyle = graphStyle.line

            if (!data.length) continue

            for(let i = 0; i < data.length; i++) {
                let [x, y] = data[i]
                let [_x, _y] = this.#toOrigin(x, y)

                if (this.#inView(_x, _y)) {
                    include.push([_x, _y, x, y])
                }
            }

            if (include.length) {
                if (graphStyle.line.fill && graphStyle.line.fill !== "transparent") {
                    let areaCoords = []
                    let lastX = include[include.length - 1][0]

                    areaCoords.push([zx, zy, 0, 0])
                    areaCoords = areaCoords.concat(include)
                    areaCoords.push([lastX, zy, 0, 0])

                    drawArea(ctx, areaCoords, lineStyle)
                }

                if (o.lines) {
                    lineFunc[`draw${capitalize(lineStyle.type)}`](ctx, include, lineStyle)
                }

                if (o.dots) {
                    for (let [_x, _y, x, y] of include) {

                        // Draw point
                        if (dotStyle.color === 'random') {
                            dotStyle.color = randomColor()
                        }
                        if (dotStyle.fill === 'random') {
                            dotStyle.fill = randomColor()
                        }

                        dotFunc[`draw${capitalize(dotStyle.type)}`](ctx, [_x, _y, dotStyle.size], dotStyle)

                        // Draw value
                        if (o.values && o.values.show) {
                            let val, tw, th
                            if (o.onDrawValue) {
                                val = o.onDrawValue.apply(this, [x, y])
                            } else {
                                val = o.values.template.replace('x', x).replace('y', y)
                            }
                            tw = textWidth(this.ctx, val, o.values.font)
                            th = val.split("\n").length * o.values.font.size
                            drawText(
                                ctx,
                                `${val}`, [_x - tw / 2 + o.values.shift.x, _y - th + o.values.shift.y, 0],
                                o.values,
                                o.values.font
                            )
                        }
                    }
                }
            }

            this.coords[index] = include
            index++
        }
    }

    drawTooltip(){
        const o = this.options
        const ctx = this.ctx
        const rect = this.canvas.getBoundingClientRect()
        const accuracy = 10
        let tooltip = false

        if (!this.data || !this.data.length) return
        if (!this.proxy.mouse) return

        let {x: mx, y: my} = this.proxy.mouse
        let [_mx, _my] = [mx, my]

        mx = (mx - rect.left) * this.dpi
        my = (my - rect.top) * this.dpi

        let index = 0
        for(let coordinates of this.coords) {
            for (const [px, py, x, y] of coordinates) {

                // console.log(px, py)

                const lx = px - accuracy, rx = px + accuracy
                const ly = py - accuracy, ry = py + accuracy

                if ((mx > lx && mx < rx) && (my > ly && my < ry)) {
                    drawCircle(ctx, [px, py, 10], this.graphs[index].dot)
                }

                if ((mx > lx && mx < rx) && (my > ly && my < ry)) {
                    this.showTooltip(ctx, [_mx, _my], [x, y], this.graphs[index].dot)
                    tooltip = true
                }
            }
            index++
        }
        if (!tooltip && this.tooltip) {
            this.removeTooltip()
        }
    }

    drawLegend(){
        if (this.data.length === 0) return

        const o = this.options
        const legend = {}, space = 10

        for(let i = 0; i < this.graphs.length; i++) {
            const graph = this.graphs[i]
            const {dot} = graph
            const {color, fill} = dot
            const name = this.graphsNames[i]

            legend[name] = {
                color,
                fill
            }
        }

        if (o.legend.vertical === false) {
            let legendWidth = 0, offset = 0
            for(let l in legend) {
                legendWidth += textWidth(this.ctx, l) + space
            }

            switch (o.legend.position) {
                case 'left': {
                    offset = this.padding.left
                    break
                }
                case 'right': {
                    offset = this.fullWidth - legendWidth * 2 - this.padding.right
                    break
                }
                case 'center': {
                    offset = (this.fullWidth - legendWidth) / 2
                    break
                }
            }

            let i = 0
            for (let l in legend) {
                const y = this.fullHeight - 30
                const x = offset + i
                const w = textWidth(this.ctx, l, o.legend.font)
                const n = o.onDrawLegend(l)
                drawSquare(this.ctx, [x, y, 10], legend[l])
                drawText(this.ctx, n, [x + 20, y, w], {...legend[l], color: '#000'}, o.legend.font)
                i += space
            }

        } else {

        }
    }

    drawLabelX(){}
    drawLabelY(){}
    showTooltip(){}
    removeTooltip(){}

    draw(){
        this.drawLabelX()
        this.drawLabelY()
        this.drawGraph()
        this.drawLegend()
        this.drawTooltip()
    }
}

Object.assign(LineChart.prototype, AxisX, AxisY, Tooltip)

export const lineChart = (...args) => new LineChart(...args)