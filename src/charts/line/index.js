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
import {defaultDotStyle, defaultFontStyle, defaultLineStyle, defaultTextStyle} from "../../defaults/index.js";
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
import {datetime} from "../../../node_modules/@olton/datetime/src/index.js";

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
        this.coords = []
        this.tooltip = null
        this.minX = null
        this.maxX = null
        this.minY = null
        this.maxY = null

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

        this.minX = o.boundaries.min.x < minX ? o.boundaries.min.x : minX
        this.maxX = o.boundaries.max.x > maxX ? o.boundaries.max.x : maxX
        this.minY = o.boundaries.min.y < minY ? o.boundaries.min.y : minY
        this.maxY = o.boundaries.max.y > maxY ? o.boundaries.max.y : maxY

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

            // console.log(this.minX. this.maxX)
            //
            // console.log(include)

            if (include.length) {

                if (o.line.fill && o.line.fill !== "transparent") {
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
                            drawText(ctx, `${val}`, [_x - tw / 2 + o.values.shift.x, _y - th + o.values.shift.y, 0], o.values)
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

    removeTooltip() {
        if (this.tooltip) {
            this.tooltip.remove()
            this.tooltip = null
        }
    }

    showTooltip(ctx, [mx, my], [x, y], style){
        const o = this.options

        this.removeTooltip()

        if (!this.data || !this.data.length) return

        let {font, shadow, border, padding, timeout} = o.tooltip

        padding = normPadding(padding)

        const tooltip = document.createElement("div")

        tooltip.style.position = 'fixed'
        tooltip.style.border = `${border.width}px ${border.lineType} ${border.color}`
        tooltip.style.borderRadius = `${border.radius}`
        tooltip.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
        tooltip.style.background = `${o.tooltip.background}`
        tooltip.style.font = `${font.style} ${font.weight} ${font.size}px/${font.lineHeight} ${font.family}`
        tooltip.style.boxShadow = `${shadow.shiftX}px ${shadow.shiftY}px ${shadow.blur}px ${shadow.color}`

        tooltip.innerHTML = o.onTooltipShow.apply(this, [x, y])

        document.querySelector('body').appendChild(tooltip)

        tooltip.style.top = `${my - tooltip.clientHeight - 15}px`
        tooltip.style.left = `${mx - tooltip.clientWidth / 2 - 5}px`

        this.tooltip = tooltip

        setTimeout(()=>{
            this.removeTooltip()
        }, timeout)
    }

    drawLabelX(){
        const o = this.options
        const labelStyle = o.labels.x
        let labelStep = 0

        if (labelStyle.step === 'auto') {
            if (labelStyle.count) {
                labelStep = Math.round((this.maxX - this.minX) / labelStyle.count)
            }
        } else {
            labelStep = labelStyle.step
        }

        if (!labelStep) return

        const _drawReferencePoint = (x, y) => {
            if (labelStyle.line && labelStyle.referencePoint) {
                drawDot(this.ctx, [x, y, 4], labelStyle.line)
            }
        }

        const _drawLabelValue = (v, x, y) => {
            if (labelStyle.showValue) {
                const val = o.onDrawLabelX(v)
                const valWidth = textWidth(this.ctx, ""+val, labelStyle.text.font)
                const valHeight = textHeight(this.ctx, ""+val, labelStyle.text.font)
                const tx = x - valWidth / 2 + labelStyle.shift.x
                const ty = y + valHeight + labelStyle.text.font.size/2 + labelStyle.shift.y
                if (labelStyle.text.angle) {
                    labelStyle.text.translate = [Math.round(tx + valWidth/2), ty]
                }
                drawText(
                    this.ctx,
                    `${val}`, [tx, ty, 0],
                    labelStyle.text
                )
            }
        }

        const _drawLine = (i, x, y) => {
            if (labelStyle.line) {
                if (i === 0 && labelStyle.skipFirst || i === labelStyle.count && labelStyle.skipLast) {
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
                console.log(datetime(+labelValue))
                x = this.padding.left + (labelValue - this.minX) * this.ratioX
            }
        } else {
            let x = this.padding.left, vy = this.padding.top + this.height, ly = this.padding.top

            let i = 0
            while (i <= this.maxX) {
                _drawLine(i, x, ly)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelX(i), x, vy)

                i += labelStep
                x = this.padding.left + i * this.ratioX
            }
        }
    }

    drawLabelY(){
        const o = this.options
        const labelStyle = o.labels.y
        let labelStep = 0

        if (labelStyle.step === 'auto') {
            if (labelStyle.count) {
                labelStep = (this.maxX - this.minX) / labelStyle.count
            }
        } else {
            labelStep = labelStyle.step
        }

        if (!labelStep) return

        const _drawReferencePoint = (x, y) => {
            if (labelStyle.line && labelStyle.referencePoint) {
                drawDot(this.ctx, [x, y, 4], labelStyle.line)
            }
        }

        const _drawLabelValue = (v, x, y) => {
            if (labelStyle.showValue) {
                const val = o.onDrawLabelY(v)
                const valWidth = textWidth(this.ctx, val, labelStyle.text.font)
                const valHeight = textHeight(this.ctx, val, labelStyle.text.font)
                console.log(val)
                drawText(
                    this.ctx,
                    `${val}`, [x - valWidth - labelStyle.text.font.size/2 + labelStyle.shift.x, y + labelStyle.shift.y, 0],
                    labelStyle.text
                )
            }
        }

        const _drawLine = (i, x, y) => {
            if (labelStyle.line) {
                if (i === 0 && labelStyle.skipFirst || i === labelStyle.count && labelStyle.skipLast) {
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
                _drawLabelValue(o.onDrawLabelX(this.maxY - (vy - this.padding.top) / this.ratioX), x, vy)

                labelValue += labelStep
                vy = (this.padding.top + this.height) - (labelValue - this.minY) * this.ratioY
            }
        } else {
            let x = this.padding.left, vy = this.padding.top + this.height, lx = this.padding.left + this.width

            let i = 0
            while (i <= this.maxY) {
                _drawLine(i, x, vy)
                _drawReferencePoint(x, vy)
                _drawLabelValue(o.onDrawLabelX(i), x, vy)

                i += labelStep
                vy = (this.padding.top + this.height) - i * this.ratioX
            }
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
                drawText(this.ctx, n, [x + 20, y, w], {textStyle: legend[l], font: {...o.legend.font}})
                i += space
            }

        } else {

        }
    }

    draw(){
        this.drawLabelX()
        this.drawLabelY()
        this.drawGraph()
        this.drawLegend()
        this.drawTooltip()
    }
}

// Object.assign(LineChart.prototype, MixinTooltip)

export const lineChart = (...args) => new LineChart(...args)