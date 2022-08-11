import {css, cssProp} from "../helpers/css.js";
import {defaultGridStyle, drawGrid} from "../mixins/grid.js";
import {
    defaultAxis,
    drawAxis
} from "../mixins/axis.js";
import {defaultCrossStyle, drawCross} from "../mixins/cross.js";
import {merge} from "../helpers/merge.js";
import {normPadding} from "../helpers/padding.js";
import {defaultTitleStyle, TEXT_BOTTOM, TEXT_TOP} from "../defaults/index.js";
import {drawText} from "../primitives/text.js";
import {textWidth} from "../helpers/text.js";

export const defaultChartOptions = {
    dpi: 1,
    padding: 0,
    grid: {
        ...defaultGridStyle,
    },
    axis: {
        ...defaultAxis,
    },
    cross: {
        ...defaultCrossStyle,
    },
    title: {
        ...defaultTitleStyle,
    },
    background: "#fff"
}

export class Chart {
    constructor(el, options = {}) {
        const that = this

        this.options = merge({}, defaultChartOptions, options)
        this.element = el
        this.container = null
        this.canvas = null
        this.ctx = null
        this.charts = []
        this.raf = null
        this.axis = this.options.axis
        this.grid = this.options.grid
        this.cross = this.options.cross
        this.padding = normPadding(this.options.padding, this.options.dpi)
        this.zero = null
        this.title = this.options.title
        this.hiddenCharts = []

        this.proxy = new Proxy({}, {
            set(...args) {
                const result = Reflect.set(...args)
                that.raf = requestAnimationFrame(that.draw.bind(that))
                return result
            }
        })

        if (typeof el === "string") {
            this.container = document.querySelector(el)
        } else if (el instanceof HTMLElement) {
            this.container = el
        }

        if (!this.container) {
            throw new Error(`You must define an element for a chart!`)
        }

        for (let o in this.options) {
            const val = this.options[o]

            if (o === "width" || o === "height") {
                this.container.style[o] = val
            } else

            if (o === "className") {
                this.container.className += val
            } else

            if (o === "css") {
                if (typeof val === "object") {
                    css(this.container, val)
                } else if (typeof val === "string") {
                    this.container.style.cssText += val
                }
            } else

            {
                if (this.container.hasOwnProperty(o))
                    this.container.setAttribute(o, options[o])
            }
        }

        const rect = this.container.getBoundingClientRect()
        const container = this.container
        const paddingLeft = cssProp(container, "paddingLeft")
        const paddingRight = cssProp(container,"paddingRight")
        const paddingTop = cssProp(container, "paddingTop")
        const paddingBottom = cssProp(container, "paddingBottom")
        const borderLeft = cssProp(container, "borderLeftWidth")
        const borderRight = cssProp(container, "borderRightWidth")
        const borderTop = cssProp(container, "borderTopWidth")
        const borderBottom = cssProp(container, "borderBottomWidth")

        this.width = rect.width
        this.height = rect.height
        this.dpi = this.options.dpi
        this.viewHeight = this.dpi * this.height
        this.viewWidth = this.dpi * this.width
        this.center = [this.viewWidth / 2, this.viewHeight / 2]
        this.radius = Math.min(this.viewHeight, this.viewWidth) / 2
        this.containerPadding = {
            top: (paddingTop + borderTop),
            right: (paddingRight + borderRight),
            bottom: (paddingBottom + borderBottom),
            left: (paddingLeft + borderLeft),
        }

        this.createCanvas()
        this.setCanvasSize()
        this.addEvents()
        this.draw()
    }

    createCanvas(){
        this.canvas = document.createElement("canvas")
        this.container.innerHTML = ""
        this.container.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')
        this.ctx.dpi = this.dpi
    }

    setCanvasSize(){
        this.canvas.style.height = this.height - this.containerPadding.top - this.containerPadding.bottom + 'px'
        this.canvas.style.width = this.width - this.containerPadding.left - this.containerPadding.right + 'px'
        this.canvas.width = this.viewWidth
        this.canvas.height = this.viewHeight
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight)
    }

    setBackground(){
        this.ctx.fillStyle = this.options.background
        this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight)
    }

    drawTitle(){
        const {text, position, font, style} = this.options.title
        let x = 0, y = 0, w = 0

        if (!text) return

        let tw = 0
        for(let line of text.toString().split("\n")) {
            const _w = textWidth(this.ctx, line, font)
            if (_w > tw) tw = _w
        }

        w = this.viewWidth - this.padding.left - this.padding.right;

        if (style.align === 'left') {
            switch (position) {
                case TEXT_TOP   :
                    x = font.size
                    y = font.size
                    break
                case TEXT_BOTTOM:
                    x = 0
                    y = this.viewHeight - this.padding.bottom + font.size
                    break
            }
        } else if (style.align === 'right') {
            switch (position) {
                case TEXT_TOP   :
                    x = this.viewWidth - font.size
                    y = font.size
                    break;
                case TEXT_BOTTOM:
                    x = this.viewWidth - font.size
                    y = this.viewHeight - this.padding.bottom + font.size
                    break;
            }
        } else if (style.align === 'center') {
            switch (position) {
                case TEXT_TOP   :
                    x = (this.viewWidth)/2
                    y = font.size
                    break;
                case TEXT_BOTTOM:
                    x = (this.viewWidth)/2
                    y = this.viewHeight - this.padding.bottom + font.size
                    break;
            }
        }

        drawText(this.ctx, text, [x, y, w], style, font)
    }

    setTitle(val, style){
        if (style) this.title = merge(this.title, style)
        this.title.text = val
        this.resize()
    }

    draw(){
        const hiddenCharts = this.hiddenCharts
        const o = this.options

        this.clearCanvas()
        this.setBackground()

        if (o.grid) drawGrid.call(this, this.ctx, typeof o.grid === "object" ? o.grid : undefined)
        if (o.axis) this.zero = drawAxis.call(this, this.ctx, typeof o.axis === "object" ? o.axis : undefined)
        if (o.cross) drawCross.call(this, this.ctx, typeof o.cross === "object" ? o.cross : undefined)

        this.charts.forEach((chart, i) => {
            if (hiddenCharts.includes(i)) return
            chart.draw()
        })

        this.drawTitle()
    }

    resize(){
        this.draw()
    }

    addChart(){
        const charts = [...arguments]

        for(let chart of charts) {
            if (!this.charts.includes(chart)) {
                chart.setSuperChart( this )
                this.charts.push(chart)
                chart.draw()
            }
        }
    }

    hideChart(index){
        if (this.hiddenCharts.includes(index)) {
            let idx = this.hiddenCharts.indexOf(index);
            if (idx !== -1) {
                this.hiddenCharts.splice(idx, 1);
            }
        } else {
            this.hiddenCharts.push(index)
        }
    }

    mouseMove(e){
        const onHover = this.options.onHover
        const {clientX: x, clientY: y} = e.changedTouches ? e.touches[0] : e

        if (typeof onHover === "function")
            onHover.apply(null, [x, y])

        this.proxy.mouse = {x, y}

        if (e.cancelable) e.preventDefault()
    }

    mouseLeave(){
        const fn = this.options.onLeave

        if (typeof fn === "function")
            fn.apply(null, [])

        this.proxy.mouse = null
    }

    addEvents(){
        const canvas = this.canvas

        canvas.addEventListener("mousemove", this.mouseMove.bind(this))
        canvas.addEventListener("touchmove", this.mouseMove.bind(this), {passive: false})
        canvas.addEventListener("mouseleave", this.mouseLeave.bind(this))
        window.addEventListener("resize", this.resize.bind(this))
    }

    destroy(){
        const canvas = this.canvas

        cancelAnimationFrame(this.raf)

        canvas.removeEventListener("mousemove", this.mouseMove.bind(this))
        canvas.removeEventListener("mouseleave", this.mouseLeave.bind(this))
        window.removeEventListener("resize", this.resize.bind(this))
    }

    saveAs(fileName, mime = "image/png"){
        const ext = mime.split("/")[1]
        const imgURL = this.canvas.toDataURL(mime);
        const dlLink = document.createElement('a');

        dlLink.download = fileName || `image.${ext}`;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [mime, dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }

    toImageSource(mime = "image/png", quality = 0.92){
        return this.ctx.toDataURL(mime, quality)
    }
}

export const chart = (el, options) => new Chart(el, options)