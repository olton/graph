import {merge} from "../../helpers/merge.js";
import {drawText} from "../../primitives/text.js";
import {textWidth} from "../../helpers/text-width.js";
import {defaultTextChartOptions} from "./default.js";

export class TextChart {
    constructor(text, [x, y], options) {
        this.text = text
        this.lines = text.split("\n")
        this.options = merge({}, defaultTextChartOptions, options)
        this.canvas = null
        this.w = 0
        this.x = x
        this.y = y
    }

    get [Symbol.toStringTag](){return "TextChart"}

    setSuperChart(chart){
        this.chart = chart
        this.ctx = chart.ctx
        this.padding = chart.padding
        this.fullWidth = chart.viewWidth
        this.fullHeight = chart.viewHeight
        this.width = chart.viewWidth - (chart.padding.left + chart.padding.right)
        this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom)
        this.dpi = chart.options.dpi
        this.w = textWidth(this.ctx, this.text)
        this.h = this.lines.length * this.options.font.size * this.options.font.lineHeight
    }

    draw(){
        const o = this.options
        let x, y, w
        switch (o.position) {
            case 'top-left': {
                x = 0
                y = this.options.font.size
                break
            }
            case 'top-center': {
                x = this.fullWidth/2
                y = this.options.font.size
                this.options.align = 'center'
                break
            }
            case 'top-right': {
                x = this.fullWidth
                y = this.options.font.size
                this.options.align = 'right'
                break
            }
            case 'bottom-left': {
                x = 0
                y = this.fullHeight - this.h
                break
            }
            case 'bottom-center': {
                x = this.fullWidth/2
                y = this.fullHeight - this.h
                this.options.align = 'center'
                break
            }
            case 'bottom-right': {
                x = this.fullWidth
                y = this.fullHeight - this.h
                this.options.align = 'right'
                break
            }
            case 'v-left-bottom': {
                x = 100
                y = 100
                this.options.angle = -90
                this.options.translate = [0 - this.h - 55, this.fullHeight + 95]
                break
            }
            default: {
                [x, y] = [this.x, this.y]
            }
        }
        console.log(this.options, [x, y, this.w])
        drawText(this.ctx, this.text,[x, y, this.w], this.options)
    }
}

export const textChart = (...args) => new TextChart(...args)