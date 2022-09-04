(function () {
    'use strict';

    const dashedName = (key) => key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);

    const css = (el, style) => {
        for(let prop in style) {
            if (el.style.hasOwnProperty(prop)) {
                el.style[prop] = style[prop];
            }
        }
    };

    const cssProp = (el, prop, type) => {
        const val = window.getComputedStyle(el).getPropertyValue(dashedName(prop));

        switch (type) {
            case 'string': return val
            case 'float': return parseFloat(val)
            case 'array': return val.split(" ")
            default: return parseInt(val)
        }
    };

    const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));

    const merge = (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return merge(target, ...sources);
    };

    const drawVector = (ctx, from, to, style = {}) => {
        const {color = '#000', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);

        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const defaultGridLineStyle = {
        color: "#e7e7e7",
        dash: [],
        size: 1,
        count: 50
    };

    const defaultGridStyle = {
        v: {
            ...defaultGridLineStyle
        },
        h: {
            ...defaultGridLineStyle
        }
    };

    function drawGrid (ctx, options = {}) {
        const gridStyle = merge({}, defaultGridStyle, options);
        const {h, v} = gridStyle;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = this.padding;
        const stepX = ((width - (padding.left + padding.right) ) / v.count);
        const stepY = ((height - (padding.top + padding.bottom) ) / h.count);
        let x, y, c;

        x = padding.left;
        y = padding.top;
        c = 0;
        do  {
            drawVector(ctx, {x, y}, {x: width - padding.right, y}, h);
            y += stepY;
            c++;
        } while (c <= h.count)

        x = padding.left;
        y = padding.top;
        c = 0;
        do {
            drawVector(ctx, {x, y}, {x, y: height - padding.bottom}, v);
            x += stepX;
            c++;
        } while (c <= v.count)
    }

    const LINE_TYPE_LINE = 'line';
    const DOT_TYPE_DOT = 'dot';
    const TEXT_ALIGN_LEFT = 'left';
    const TEXT_TOP = 'text-top';
    const TEXT_BOTTOM = 'text-bottom';
    const TOP_LEFT = 'top-left';
    const TOP_CENTER = 'top-center';
    const TOP_RIGHT = 'top-right';
    const BOTTOM_LEFT = 'bottom-left';
    const BOTTOM_CENTER = 'bottom-center';
    const BOTTOM_RIGHT = 'bottom-right';

    const defaultBoundaries = {
        min: {
            x: null,
            y: null
        },
        max: {
            x: null,
            y: null
        },
        increment: null
    };

    const defaultDotStyle = {
        type: DOT_TYPE_DOT,
        size: 1,
        color: "#000",
        fill: "#000",
        dash: []
    };

    const defaultLineStyle = {
        color: "#000",
        dash: [],
        size: 1,
        type: LINE_TYPE_LINE
    };

    const defaultFontStyle = {
        style: 'normal',
        weight: 'normal',
        size: 16,
        lineHeight: 1,
        family: 'sans-serif'
    };

    const defaultTextStyle = {
        color: "#000",
        angle: 0,
        align: TEXT_ALIGN_LEFT,
        translate: [0,0],
        baseline: "middle"
    };

    const defaultValueStyle = {
        ...defaultTextStyle,
        font: {
            ...defaultFontStyle
        },
        fixed: false,
        template: `[x, y]`,
        show: true,
        shift: {
            x: 0,
            y: 0,
        }
    };

    const defaultLineChartGraph = {
        dot: {
            ...defaultDotStyle
        },
        line: {
            ...defaultLineStyle
        }
    };

    const defaultBorder = {
        width: 1,
        lineType: 'solid',
        color: '#ffc351',
        radius: 0
    };

    const defaultTooltip = {
        width: "auto",
        background: "#ffedbc",
        color: "#000",
        font: defaultFontStyle,
        border: defaultBorder,
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        },
        shadow: {
            shiftX: 2,
            shiftY: 2,
            blur: 4,
            stretch: 0,
            color: 'rgba(0,0,0,.5)'
        },
        timeout: 5000,
    };

    const defaultLabelStyle = {
        count: 5,
        step: "auto",
        line: {
            ...defaultLineStyle
        },
        text: {
            ...defaultTextStyle,
        },
        font: {
            ...defaultFontStyle,
            size: 24
        },
        referencePoint: true,
        skipFirst: true,
        skipLast: true,
        skip: 0,
        showValue: true,
        fixed: 0,
        shift: {
            x: 0,
            y: 0
        }
    };

    const defaultLabelStyleX = {
        ...defaultLabelStyle,
        text: {
            ...defaultTextStyle,
            angle: -45,
            align: 'right'
        }
    };

    const defaultLabelStyleY = {
        ...defaultLabelStyle
    };

    const defaultLegendStyle = {
        background: '#fff',
        border: {
            ...defaultBorder
        },
        font: {
            ...defaultFontStyle
        },
        position: 'left', // hor: left, right, center  ver: right, left
        vertical: false,
        rtl: false,
        shift: {
            x: 0,
            y: 0
        }
    };

    const defaultTitleStyle = {
        text: "",
        position: TOP_LEFT,
        font: {
            ...defaultFontStyle,
            size: 24
        },
        style: {
            ...defaultTextStyle,
        },
    };

    const ORIGIN_TOP_LEFT = "top-left"; //+
    const ORIGIN_TOP_RIGHT = "top-right"; //+
    const ORIGIN_BOTTOM_RIGHT = "bottom-right"; //+
    const ORIGIN_BOTTOM_LEFT = "bottom-left"; //+
    const ORIGIN_TOP_CENTER = "top-center"; //+
    const ORIGIN_BOTTOM_CENTER = "bottom-center"; //+
    const ORIGIN_CENTER_CENTER = "center-center"; //+
    const ORIGIN_LEFT_CENTER = "left-center"; //+
    const ORIGIN_RIGHT_CENTER = "right-center"; //+

    const factor = {
        factor: 10,
        subFactor: 2
    };

    const defaultAxis = {
        origin: ORIGIN_BOTTOM_LEFT,
        padding: 0,
        x: {
            style: {
                ...defaultLineStyle,
                ...factor
            },
            show: true,
        },
        y: {
            style: {
                ...defaultLineStyle,
                ...factor
            },
            show: true,
        },
    };

    function drawAxis (ctx, options = {}) {
        const axis = merge({}, defaultAxis, options);
        const {x: ax, y: ay, origin} = axis;
        const styleX = ax.style, styleY = ay.style;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = this.padding;

        let x, y, x2, y2, zero = {x: 0, y: 0};

        const arrowLeft = (x, y) => {
            drawVector(ctx,{x, y},{x: x + styleX.factor, y: y - styleX.factor / styleX.subFactor}, styleX);
            drawVector(ctx,{x, y},{x: x + styleX.factor, y: y + styleX.factor / styleX.subFactor}, styleX);
        };

        const arrowRight = (x, y) => {
            drawVector(ctx,{x, y},{x: x - styleX.factor, y: y - styleX.factor / styleX.subFactor}, styleX);
            drawVector(ctx,{x, y},{x: x - styleX.factor, y: y + styleX.factor / styleX.subFactor}, styleX);
        };

        const arrowUp = (x, y) => {
            drawVector(ctx, {x, y}, {x: x - styleY.factor / styleY.subFactor, y: y + styleY.factor}, styleY);
            drawVector(ctx, {x, y}, {x: x + styleY.factor / styleY.subFactor, y: y + styleY.factor}, styleY);
        };

        const arrowDown = (x, y) => {
            drawVector(ctx, {x, y}, {x: x - styleY.factor / styleY.subFactor, y: y - styleY.factor}, styleY);
            drawVector(ctx, {x, y}, {x: x + styleY.factor / styleY.subFactor, y: y - styleY.factor}, styleY);
        };

        const axisHorizontalCenter = () => {
            x = padding.left; x2 = width - padding.right;
            y = padding.top + (height - (padding.top + padding.bottom) - styleX.size) / 2; y2 = y;
            drawVector(ctx,{x, y},{x: x2, y: y2}, styleX);
        };

        const axisVerticalCenter = () => {
            x = padding.left + (width - (padding.left + padding.right) - styleY.size) / 2; x2 = x;
            y = padding.top; y2 = height - padding.bottom;
            drawVector(ctx,{x, y},{x: x2, y: y2}, styleY);
        };

        const axisHorizontalBottom = () => {
            x = padding.left; x2 = width - padding.right;
            y = height - padding.bottom - styleX.size; y2 = y;
            drawVector(ctx,{x, y},{x: x2, y: y2}, styleX);
        };

        const axisHorizontalTop = () => {
            x = padding.left; x2 = width - padding.right;
            y = padding.top + styleX.size; y2 = y;
            drawVector(ctx,{x, y},{x: x2, y: y2}, styleX);
        };

        const axisVerticalLeft = () => {
            x = padding.left + styleY.size;
            y = padding.top; y2 = height - padding.bottom;
            drawVector(ctx,{x, y},{x, y: y2}, styleY);
        };

        const axisVerticalRight = () => {
            x = width - (padding.right + styleY.size);
            y = padding.top; y2 = height - padding.bottom;
            drawVector(ctx,{x, y},{x, y: y2}, styleY);
        };

        if (origin === ORIGIN_CENTER_CENTER) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalCenter();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                        arrowRight(x2, y);
                    }
                }
                zero.x = x + (x2-x)/2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalCenter();
                    if (styleY.factor) {
                        arrowUp(x, y);
                        arrowDown(x, y2);
                    }
                }
                zero.y = y + (y2-y)/2;
            }
        }

        if (origin === ORIGIN_BOTTOM_CENTER) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalBottom();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                        arrowRight(x2, y2);
                    }
                }
                zero.x = x + (x2-x)/2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalCenter();
                    if (styleY.factor) {
                        arrowUp(x, y);
                    }
                }
                zero.y = y2;
            }
        }

        if (origin === ORIGIN_TOP_CENTER) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalTop();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                        arrowRight(x2, y2);
                    }
                }
                zero.x = x + (x2-x)/2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalCenter();
                    if (styleY.factor) {
                        arrowDown(x, y2);
                    }
                }
                zero.y = y;
            }
        }

        if (origin === ORIGIN_LEFT_CENTER) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalCenter();
                    if (styleX.factor) {
                        arrowRight(x2, y);
                    }
                }
                zero.x = x;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalLeft();
                    if (styleY.factor) {
                        arrowUp(x, y);
                        arrowDown(x, y2);
                    }
                }
                zero.y = y + (y2-y)/2;
            }
        }

        if (origin === ORIGIN_RIGHT_CENTER) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalCenter();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                    }
                }
                zero.x = x2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalRight();
                    if (styleY.factor) {
                        arrowUp(x, y);
                        arrowDown(x, y2);
                    }
                }
                zero.y = y +(y2-y)/2;
            }
        }

        if (origin === ORIGIN_TOP_LEFT) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalTop();
                    if (styleX.factor) {
                        arrowRight(x2, y);
                    }
                }
                zero.x = x;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalLeft();
                    if (styleY.factor) {
                        arrowDown(x, y2);
                    }
                }
                zero.y = y;
            }
        }

        if (origin === ORIGIN_BOTTOM_LEFT) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalBottom();
                    if (styleX.factor) {
                        arrowRight(x2, y2);
                    }
                }
                zero.x = x;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalLeft();
                    if (styleY.factor) {
                        arrowUp(x, y);
                    }
                }
                zero.y = y2;
            }
        }

        if (origin === ORIGIN_BOTTOM_RIGHT) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalBottom();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                    }
                }
                zero.x = x2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalRight();
                    if (styleY.factor) {
                        arrowUp(x, y);
                    }
                }
                zero.y = y2;
            }
        }

        if (origin === ORIGIN_TOP_RIGHT) {
            if (styleX) {
                if (ax.show) {
                    axisHorizontalTop();
                    if (styleX.factor) {
                        arrowLeft(x, y);
                    }
                }
                zero.x = x2;
            }
            if (styleY) {
                if (ay.show) {
                    axisVerticalRight();
                    if (styleY.factor) {
                        arrowDown(x2 - 2, y2);
                    }
                }
                zero.y = y;
            }
        }

        return zero
    }

    const toOrigin = (_x, _y, zero) => {
        const {x: zx, y: zy} = zero;
        return [_x + zx -1 , _y + zy - _y*2 - 1]
    };

    /**
     *
     * @param ctx Canvas context
     * @param x Center X
     * @param y Center Y
     * @param r Radius
     * @param sa StartAngle in Radians
     * @param ea EndAngle in Radians
     * @param {Object} style
     */
    const drawArc = (ctx, [x, y, r = 10, sa = 0, ea = 2 * Math.PI], style = {}) => {
        const {fill = '#000', color = '#000', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = fill;

        ctx.arc(x, y, r, sa, ea);

        ctx.stroke();
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    };

    const drawDot = (ctx, [x, y, r], style = {}) => drawArc(ctx, [x, y, r, 0, 2 * Math.PI], {...style, fill: style.color});

    const drawCircle = (ctx, [x, y, r], style) => drawArc(ctx, [x, y, r, 0, 2 * Math.PI], style);

    const drawSquare = (ctx, [x, y, r], style = {}) => {
        const {color = '#000', fill = '#fff', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = fill;

        ctx.rect(x - r, y - r, r * 2, r * 2);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const drawDiamond = (ctx, [x, y, r], style = {}) => {
        const {color = '#000', fill = '#fff', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = fill;

        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.lineTo(x, y - r);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const capitalize = v => v[0].toUpperCase() + v.substring(1);

    const defaultCrossLineStyle = {
        size: 1,
        dash: [5, 5],
        color: "#000"
    };

    const defaultCrossArcStyle = {
        size: 1,
        dash: [4, 4],
        color: "#000",
        fill: "transparent",
        radius: 20,
        type: "circle"
    };

    const defaultCrossStyle = {
        line: {
            ...defaultCrossLineStyle
        },
        arc: {
            ...defaultCrossArcStyle
        }
    };

    const arcFunc = {
        drawDiamond,
        drawCircle,
        drawSquare
    };

    function drawCross(ctx, options = {}){
        const {line: lineStyle, arc: arcStyle} = merge({}, defaultCrossStyle, options);
        const rect = ctx.canvas.getBoundingClientRect();
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const dpi = this.dpi;
        const proxy = this.proxy;
        const padding = this.padding;

        if (!proxy || !proxy.mouse) return

        let {x, y} = proxy.mouse;

        x = (x - rect.left) * dpi;
        y = (y - rect.top) * dpi;

        if ((y > padding.top && y < height - padding.bottom) && (x > padding.left && x < width - padding.right)) {
            drawVector(ctx, {x: padding.left, y}, {x: width - padding.right, y}, lineStyle);
            drawVector(ctx, {x, y: padding.top}, {x, y: height - padding.bottom}, lineStyle);

            if (arcStyle.type !== 'none') arcFunc[`draw${capitalize(arcStyle.type)}`](ctx, [x, y, arcStyle.radius], arcStyle);
        }
    }

    const normPadding = (p, d = 1) => {
        let [top, right, bottom, left] = [0,0,0,0];

        if (typeof p === 'number' || !isNaN(p)) {
            [top, right, bottom, left] = [+p,+p,+p,+p];
        }

        else if (typeof p === 'string') {
            [top = 0, right = 0, bottom = 0, left = 0] = p.split(",").map(v => v.trim());
        }

        else if (typeof p === "object") {
            top = p.top ? p.top : 0;
            left = p.left ? p.left : 0;
            right = p.right ? p.right : 0;
            bottom = p.bottom ? p.bottom : 0;
        }

        return {
            top: top * d,
            left: left * d,
            right: right * d,
            bottom: bottom * d
        }
    };

    const textWidth = (ctx, text, font = {}) => {
        const {style = 'normal', weight = 'normal', size = 12, lineHeight = 1, family = 'sans-serif'} = font;

        ctx.save();
        ctx.beginPath();
        ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`;

        const lines = text.toString().split('\n');
        let tw = 0;
        for(let line of lines) {
            const _w = ctx.measureText(text).width;
            if (_w > tw) tw = _w;
        }
        ctx.closePath();
        ctx.restore();
        return tw
    };

    const textHeight = (ctx, text) => {
        const lines = text.split("\n");
        const box = ctx.measureText(text);
        return (box.fontBoundingBoxAscent + box.fontBoundingBoxDescent) * lines.length
    };

    const drawText = (ctx, text, [x = 0, y = 0, w = 0], textStyle = {}, font = {}, box = {}) => {
        const {align = 'left', baseLine = 'middle', color = '#000', stroke = '#000'} = textStyle;
        const {style = 'normal', weight = 'normal', size = 12, lineHeight = 1, family = 'sans-serif'} = font;
        let tw = 0;

        tw = textWidth(ctx, text, font);

        ctx.save();
        ctx.beginPath();

        ctx.textAlign = align;
        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
        ctx.font = `${style} ${weight} ${size}px/${lineHeight} ${family}`;
        ctx.textBaseline = baseLine;

        text.split("\n").map( (str, i) => {
            ctx.fillText(str, x, y + (i * lineHeight * font.size), w || tw);
        });

        ctx.closePath();
        ctx.restore();
    };

    const defaultChartOptions = {
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
    };

    class Chart {
        constructor(el, options = {}) {
            const that = this;

            this.options = merge({}, defaultChartOptions, options);
            this.element = el;
            this.container = null;
            this.canvas = null;
            this.ctx = null;
            this.charts = [];
            this.raf = null;
            this.axis = this.options.axis;
            this.grid = this.options.grid;
            this.cross = this.options.cross;
            this.padding = normPadding(this.options.padding, this.options.dpi);
            this.zero = null;
            this.title = this.options.title;
            this.hiddenCharts = [];

            this.proxy = new Proxy({}, {
                set(...args) {
                    const result = Reflect.set(...args);
                    that.raf = requestAnimationFrame(that.draw.bind(that));
                    return result
                }
            });

            if (typeof el === "string") {
                this.container = document.querySelector(el);
            } else if (el instanceof HTMLElement) {
                this.container = el;
            }

            if (!this.container) {
                throw new Error(`You must define an element for a chart!`)
            }

            for (let o in this.options) {
                const val = this.options[o];

                if (o === "width" || o === "height") {
                    this.container.style[o] = val;
                } else

                if (o === "className") {
                    this.container.className += val;
                } else

                if (o === "css") {
                    if (typeof val === "object") {
                        css(this.container, val);
                    } else if (typeof val === "string") {
                        this.container.style.cssText += val;
                    }
                } else

                {
                    if (this.container.hasOwnProperty(o))
                        this.container.setAttribute(o, options[o]);
                }
            }

            const rect = this.container.getBoundingClientRect();
            const container = this.container;
            const paddingLeft = cssProp(container, "paddingLeft");
            const paddingRight = cssProp(container,"paddingRight");
            const paddingTop = cssProp(container, "paddingTop");
            const paddingBottom = cssProp(container, "paddingBottom");
            const borderLeft = cssProp(container, "borderLeftWidth");
            const borderRight = cssProp(container, "borderRightWidth");
            const borderTop = cssProp(container, "borderTopWidth");
            const borderBottom = cssProp(container, "borderBottomWidth");

            this.width = rect.width;
            this.height = rect.height;
            this.dpi = this.options.dpi;
            this.viewHeight = this.dpi * this.height;
            this.viewWidth = this.dpi * this.width;
            this.center = [this.viewWidth / 2, this.viewHeight / 2];
            this.radius = Math.min(this.viewHeight, this.viewWidth) / 2;
            this.containerPadding = {
                top: (paddingTop + borderTop),
                right: (paddingRight + borderRight),
                bottom: (paddingBottom + borderBottom),
                left: (paddingLeft + borderLeft),
            };

            this.createCanvas();
            this.setCanvasSize();
            this.addEvents();
            this.draw();
        }

        createCanvas(){
            this.canvas = document.createElement("canvas");
            this.container.innerHTML = "";
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.ctx.dpi = this.dpi;
        }

        setCanvasSize(){
            this.canvas.style.height = this.height - this.containerPadding.top - this.containerPadding.bottom + 'px';
            this.canvas.style.width = this.width - this.containerPadding.left - this.containerPadding.right + 'px';
            this.canvas.width = this.viewWidth;
            this.canvas.height = this.viewHeight;
        }

        clearCanvas(){
            this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        }

        setBackground(){
            this.ctx.fillStyle = this.options.background;
            this.ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);
        }

        drawTitle(){
            const {text, position, font, style} = this.options.title;
            let x = 0, y = 0, w = 0;

            if (!text) return
            for(let line of text.toString().split("\n")) {
                textWidth(this.ctx, line, font);
            }

            w = this.viewWidth - this.padding.left - this.padding.right;

            if (style.align === 'left') {
                switch (position) {
                    case TEXT_TOP   :
                        x = font.size;
                        y = font.size;
                        break
                    case TEXT_BOTTOM:
                        x = 0;
                        y = this.viewHeight - this.padding.bottom + font.size;
                        break
                }
            } else if (style.align === 'right') {
                switch (position) {
                    case TEXT_TOP   :
                        x = this.viewWidth - font.size;
                        y = font.size;
                        break;
                    case TEXT_BOTTOM:
                        x = this.viewWidth - font.size;
                        y = this.viewHeight - this.padding.bottom + font.size;
                        break;
                }
            } else if (style.align === 'center') {
                switch (position) {
                    case TEXT_TOP   :
                        x = (this.viewWidth)/2;
                        y = font.size;
                        break;
                    case TEXT_BOTTOM:
                        x = (this.viewWidth)/2;
                        y = this.viewHeight - this.padding.bottom + font.size;
                        break;
                }
            }

            drawText(this.ctx, text, [x, y, w], style, font);
        }

        setTitle(val, style){
            if (style) this.title = merge(this.title, style);
            this.title.text = val;
            this.resize();
        }

        draw(){
            const hiddenCharts = this.hiddenCharts;
            const o = this.options;

            this.clearCanvas();
            this.setBackground();

            if (o.grid) drawGrid.call(this, this.ctx, typeof o.grid === "object" ? o.grid : undefined);
            if (o.axis) this.zero = drawAxis.call(this, this.ctx, typeof o.axis === "object" ? o.axis : undefined);
            if (o.cross) drawCross.call(this, this.ctx, typeof o.cross === "object" ? o.cross : undefined);

            this.charts.forEach((chart, i) => {
                if (hiddenCharts.includes(i)) return
                chart.draw();
            });

            this.drawTitle();
        }

        resize(){
            this.draw();
        }

        addChart(){
            const charts = [...arguments];

            for(let chart of charts) {
                if (!this.charts.includes(chart)) {
                    chart.setSuperChart( this );
                    this.charts.push(chart);
                    chart.draw();
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
                this.hiddenCharts.push(index);
            }
        }

        mouseMove(e){
            const onHover = this.options.onHover;
            const {clientX: x, clientY: y} = e.changedTouches ? e.touches[0] : e;

            if (typeof onHover === "function")
                onHover.apply(null, [x, y]);

            this.proxy.mouse = {x, y};

            if (e.cancelable) e.preventDefault();
        }

        mouseLeave(){
            const fn = this.options.onLeave;

            if (typeof fn === "function")
                fn.apply(null, []);

            this.proxy.mouse = null;
        }

        addEvents(){
            const canvas = this.canvas;

            canvas.addEventListener("mousemove", this.mouseMove.bind(this));
            canvas.addEventListener("touchmove", this.mouseMove.bind(this), {passive: false});
            canvas.addEventListener("mouseleave", this.mouseLeave.bind(this));
            window.addEventListener("resize", this.resize.bind(this));
        }

        destroy(){
            const canvas = this.canvas;

            cancelAnimationFrame(this.raf);

            canvas.removeEventListener("mousemove", this.mouseMove.bind(this));
            canvas.removeEventListener("mouseleave", this.mouseLeave.bind(this));
            window.removeEventListener("resize", this.resize.bind(this));
        }

        saveAs(fileName, mime = "image/png"){
            const ext = mime.split("/")[1];
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

    const drawLine = (ctx, coords = [], style = {}) => {
        const {color = '#000', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        coords.map(([x, y]) => {
            ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const drawCurve = (ctx, coords = [], style = {}, tension = 0.25) => {
        const {color = '#000', size = 1, dash = []} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        ctx.moveTo(coords[0][0], coords[0][1]);

        for(let i = 0; i < coords.length-1; i ++) {
            let x_mid = (coords[i][0] + coords[i + 1][0]) / 2;
            let y_mid = (coords[i][1] + coords[i + 1][1]) / 2;

            ctx.quadraticCurveTo((x_mid + coords[i][0]) / 2, coords[i][1], x_mid, y_mid);
            ctx.quadraticCurveTo((x_mid + coords[i + 1][0]) / 2, coords[i + 1][1], coords[i + 1][0], coords[i + 1][1]);
        }

        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const drawTriangle = (ctx, [x, y, r], style = {}) => {
        const {color = '#000', fill = '#fff', size = 1} = style;

        ctx.beginPath();
        ctx.save();
        ctx.setLineDash([]);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = fill;

        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y + r);
        ctx.lineTo(x - r, y + r);
        ctx.lineTo(x, y - r);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.closePath();
    };

    const defaultPointChartOptions = {
        graphs: [],
        boundaries: {
            min: {
                x: 0,
                y: 0,
                d: 0
            },
            max: {
                x: 100,
                y: 100,
                d: 0
            },
            increment: 0
        },
        lines: true,
        dots: true,
        origin: true,
        maxGraphSize: 0,
        dot: {
            ...defaultDotStyle
        },
        line: {
            ...defaultLineStyle
        },
        font: {
            ...defaultFontStyle
        },
        title: {
            align: 'left',
            baseLine: 'middle',
            color: '#000',
            stroke: '#000',
            font: {
                ...defaultFontStyle
            },
            angle: 0,
            translate: [0,0]
        },
        labels: {
            x: {

            },
            y: {

            }
        },
        values: {
            ...defaultValueStyle
        },
        boundariesValues: {
            style: {
                ...defaultValueStyle
            },
            zeroPoint: false,
            zero: false,
            minX: false,
            maxX: false,
            minY: false,
            maxY: false
        }
    };

    const drawZeroBoundaries = (ctx, zero, origin, val, style) => {
        let x, y, tx, ty;
        const {x: zx, y:zy} = zero;

        x = zx;
        y = zy;

        console.log(style);

        switch (origin){
            case ORIGIN_CENTER_CENTER: {
                tx = x + 10;
                ty = y - 16;
                x -= 1;
                y -= 1;
                break
            }
            case ORIGIN_TOP_LEFT: {
                tx = x + 10;
                ty = y + 16;
                x += 2;
                y += 2;
                break
            }
            case ORIGIN_TOP_CENTER: {
                tx = x + 10;
                ty = y + 16;
                y += 2;
                break
            }
            case ORIGIN_TOP_RIGHT: {
                tx = x - 36;
                ty = y + 16;
                x -= 2;
                y += 2;
                break
            }
            case ORIGIN_BOTTOM_LEFT: {
                tx = x + 10;
                ty = y - 16;
                x += 2;
                y -= 2;
                break
            }
            case ORIGIN_BOTTOM_CENTER: {
                tx = x + 10;
                ty = y - 16;
                x -= 1;
                y -= 2;
                break
            }
            case ORIGIN_BOTTOM_RIGHT: {
                tx = x - 36;
                ty = y - 16;
                x -= 2;
                y -= 2;
                break
            }
            case ORIGIN_RIGHT_CENTER: {
                tx = x - 36;
                ty = y - 16;
                x -= 2;
                y -= 1;
                break
            }
            case ORIGIN_LEFT_CENTER: {
                tx = x + 10;
                ty = y - 16;
                x += 2;
                y -= 1;
                break
            }
        }
        if (style.zeroPoint) drawCircle(ctx, [x, y, 4], {});
        drawText(ctx, val, [tx, ty, 0], style);
    };

    const drawMinXBoundaries = (ctx, minX, zero, origin, val, style) => {
        let x, y, tx, ty;
        const {x: zx, y:zy} = zero;

        x = zx;
        y = zy;

        switch (origin){
            case ORIGIN_CENTER_CENTER: {
                tx = x + minX;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_CENTER: {
                tx = x + minX;
                ty = y + 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_RIGHT: {
                tx = x + minX;
                ty = y + 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_CENTER: {
                tx = x + minX;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_RIGHT: {
                tx = x + minX;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_RIGHT_CENTER: {
                tx = x + minX * 2;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
        }
    };

    const drawMaxXBoundaries = (ctx, maxX, zero, origin, val, style) => {
        let x, y, tx, ty, tw;
        const {x: zx, y:zy} = zero;

        x = zx;
        y = zy;

        tw = ctx.measureText(val).width;

        switch (origin){
            case ORIGIN_CENTER_CENTER: {
                console.log(ctx.measureText(val).width);
                tx = x + maxX - 10 - tw;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_LEFT: {
                tx = x + maxX - 10 - tw;
                ty = y + 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_CENTER: {
                tx = x + maxX - 10 - tw;
                ty = y + 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_RIGHT: {
                tx = x + maxX;
                ty = y + 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_LEFT: {
                tx = x + maxX - 10 - tw;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_CENTER: {
                tx = x + maxX - 10 - tw;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_RIGHT: {
                tx = x + maxX;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_RIGHT_CENTER: {
                tx = x + maxX * 2;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_LEFT_CENTER: {
                tx = x + maxX * 2 - 10 - tw;
                ty = y - 16;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
        }
    };

    const drawMinYBoundaries = (ctx, minY, zero, origin, val, style) => {
        let x, y, tx, ty;
        const {x: zx, y:zy} = zero;

        x = zx;
        y = zy;

        switch (origin){
            case ORIGIN_CENTER_CENTER: {
                tx = x + 10;
                ty = y - minY - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_LEFT: {
                tx = x + 10;
                ty = y - minY - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_CENTER: {
                tx = x + 10;
                ty = y - minY * 2 - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_TOP_RIGHT: {
                tx = x - 46;
                ty = y - minY - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_RIGHT_CENTER: {
                tx = x - 46;
                ty = y - minY - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_LEFT_CENTER: {
                tx = x + 10;
                ty = y - minY - 5;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
        }
    };

    const drawMaxYBoundaries = (ctx, maxY, zero, origin, val, style) => {
        let x, y, tx, ty;
        const {x: zx, y:zy} = zero;

        x = zx;
        y = zy;

        switch (origin){
            case ORIGIN_CENTER_CENTER: {
                tx = x + 10;
                ty = y - maxY + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_LEFT: {
                tx = x + 10;
                ty = y - maxY + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_CENTER: {
                tx = x + 10;
                ty = y - maxY * 2 + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_BOTTOM_RIGHT: {
                tx = x - 40;
                ty = y - maxY + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_LEFT_CENTER: {
                tx = x + 10;
                ty = y - maxY + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
            case ORIGIN_RIGHT_CENTER: {
                tx = x - 46;
                ty = y - maxY + 10;
                drawText(ctx, val, [tx, ty, 0], style);
                break
            }
        }
    };

    const randomColor = () => "#"+Math.floor(Math.random()*16777215).toString(16);

    const dotFunc$1 = {
        drawCircle,
        drawSquare,
        drawTriangle,
        drawDiamond,
        drawDot
    };

    const lineFunc$1 = {
        drawLine,
        drawCurve
    };

    class PointChart {
        constructor(data, options) {
            this.data = [...data];
            this.options = merge({}, defaultPointChartOptions, options);
            this.canvas = null;
            this.graphs = [];
            this.coords = [];

            const that = this;

            this.data.forEach((data, index) => {
                if (that.options.graphs[index]) {
                    const dot = merge({}, defaultDotStyle, that.options.dot, that.options.graphs[index].dot);
                    const line = merge({}, defaultLineStyle, that.options.line, that.options.graphs[index].line);
                    that.graphs.push(merge({}, defaultPointChartOptions, {dot, line}));
                } else {
                    that.graphs.push(merge({}, defaultPointChartOptions, {dot: that.options.dot, line: that.options.line}));
                }
            });

            this.calcMinMax();
        }

        get [Symbol.toStringTag](){return "PointChart"}

        setSuperChart(chart){
            this.chart = chart;
            this.padding = chart.padding;
            this.fullWidth = chart.viewWidth;
            this.fullHeight = chart.viewHeight;
            this.width = chart.viewWidth - (chart.padding.left + chart.padding.right);
            this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom);
            this.origin = chart.options.axis.origin;
            this.zero = chart.zero;
            this.dpi = chart.options.dpi;

            this.calcRatio();
        }

        calcMinMax(){
            let minX = this.options.boundaries.min.x,
                maxX = this.options.boundaries.max.x;
            let minY = this.options.boundaries.min.y,
                maxY = this.options.boundaries.max.y;

            const inc = this.options.boundaries.increment / 100;

            this.minX = minX + minX * inc;
            this.maxX = maxX + maxX * inc;
            this.minY = minY + minY * inc;
            this.maxY = maxY + maxY * inc;
        }

        calcRatio(){
            const a = ["top-left", "top-right", "bottom-left", "bottom-right"];
            const mod = a.includes(this.origin) ? 2 : 1;

            this.ratioX = this.width / (this.maxX - this.minX) * mod;
            this.ratioY = this.height / (this.maxY - this.minY) * mod;
        }

        add(index, [x, y]){
            const o = this.options;
            const maxSize = o.maxGraphSize;

            if (maxSize) {
                while (this.data[index].length > maxSize - 1) {
                    this.data[index].shift();
                }
            }

            this.data[index].push([x, y]);

            this.chart.resize();
        }

        #inView(x, y){
            const {left, top} = this.padding;
            const minX = left - 1;
            const maxX = left + this.width + 1;
            const minY = top - 1;
            const maxY = top + this.height + 1;

            return (x >= minX && x <= maxX) && (y >= minY && y <= maxY)
        }

        drawBoundaries(){
            const {zero, minX, maxX, minY, maxY, style, zeroPoint} = this.options.boundariesValues;

            if (zero) {
                const text = `${(this.minX+this.maxX)/2}, ${(this.minY+this.maxY)/2}`;
                drawZeroBoundaries(this.chart.ctx, this.zero, this.origin, text, {...style, zeroPoint });
            }
            if (minX) {
                const text = `${this.minX}`;
                drawMinXBoundaries(this.chart.ctx, this.minX * this.ratioX, this.zero, this.origin, text, style);
            }
            if (maxX) {
                const text = `${this.maxX}`;
                drawMaxXBoundaries(this.chart.ctx, this.maxX * this.ratioX, this.zero, this.origin, text, style);
            }
            if (minY) {
                const text = `${this.minY}`;
                drawMinYBoundaries(this.chart.ctx, this.minY * this.ratioY, this.zero, this.origin, text, style);
            }
            if (maxY) {
                const text = `${this.maxY}`;
                drawMaxYBoundaries(this.chart.ctx, this.maxY * this.ratioY, this.zero, this.origin, text, style);
            }
        }

        drawGraph(){
            if (!this.data || !this.data.length) return

            const coords = [], include = [];
            let index = 0;
            const ctx = this.chart.ctx;
            const dpi = this.chart.dpi;
            const o = this.options;

            for(let data of this.data) {
                const graphStyle = this.graphs[index];
                const dotStyle = graphStyle.dot;
                dotStyle.color;
                const lineStyle = graphStyle.line;

                for(let i = 0; i < data.length; i++) {
                    let [x, y] = data[i];
                    let _x, _y;

                    _x = Math.round((this.origin ? x : x - this.minX) * this.ratioX);
                    _y = Math.round((this.origin ? y : y - this.minY) * this.ratioY);

                    if (this.origin) {
                        [_x, _y] = toOrigin(_x, _y, this.chart.zero);
                    }

                    coords.push([_x, _y, x, y]);

                    if (this.#inView(_x, _y)) {
                        include.push([_x, _y, x, y]);
                    }
                }

                if (o.lines) {
                    lineFunc$1[`draw${capitalize(lineStyle.type)}`](ctx, include, lineStyle);
                }

                if (o.dots) {
                    for(let [_x, _y, x, y] of include) {
                        if (dotStyle.color === 'random') {
                            dotStyle.color = randomColor();
                        }
                        dotFunc$1[`draw${capitalize(dotStyle.type)}`](ctx, [_x, _y, dotStyle.size], dotStyle);

                        if (o.values && o.values.show) {
                            const val = o.values.template.replace('x', x).replace('y', y);
                            drawText(
                                ctx,
                                `${val}`, [_x + o.values.translate[0] * dpi, _y + o.values.translate[1] * dpi, 0],
                                o.values,
                                o.values.font
                            );
                        }
                    }
                }

                this.coords[index] = coords;

                index++;
            }
        }

        draw(){
            this.drawBoundaries();
            this.drawGraph();
        }
    }

    const drawArea = (ctx, coords = [], style = {}) => {
        const {color = '#000', fill = '#000', size = 1, dash = []} = style;
        
        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(dash);
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.fillStyle = fill;

        coords.map(([x, y]) => {
            ctx.lineTo(x, y);
        });
        ctx.lineTo(coords[0][0], coords[0][1]);

        ctx.fill();
        ctx.restore();
        ctx.closePath();
    };

    const defaultLineChartOptions = {
        graphs: [],
        boundaries: {
            ...defaultBoundaries
        },
        lines: true,
        dots: true,
        origin: true,
        maxGraphSize: 0,
        dot: {
            ...defaultDotStyle
        },
        line: {
            ...defaultLineStyle,
            fill: "transparent"
        },
        font: {
            ...defaultFontStyle
        },
        labels: {
            x: {
                ...defaultLabelStyleX
            },
            y: {
                ...defaultLabelStyleY
            }
        },
        values: {
            ...defaultValueStyle
        },
        tooltip: {
            ...defaultTooltip
        },
        legend: {
            ...defaultLegendStyle
        },
        onTooltipShow: (x, y) => `(${x}, ${y})`,
        onDrawValue: (x, y) => `(${x}, ${y})`,
        onDrawLabelX: (v) => `${v}`,
        onDrawLabelY: (v) => `${v}`,
        onDrawLegend: (v) => `${v}`,
    };

    const minMax = (data = [], by = 'x') => {
        let min, max, v;
        let index;

        if (typeof by === "number") {
            index = by;
        } else {
            switch (by.toString().toLowerCase()) {
                case 'y':
                    index = 1;
                    break
                case 'z':
                    index = 2;
                    break
                default:
                    index = 0;
            }
        }

        for (const _ of data) {
            v = _[index];

            if (isNaN(min) || min > v) min = v;
            if (isNaN(max) || max < v) max = v;
        }

        return [min, max]
    };

    const isNumber = v => typeof v !== "undefined" && v !== null && !isNaN(+v);

    const AxisY = {
        drawLabelY(){
            const o = this.options;
            const labelStyle = o.labels.y;
            let labelStep = 0;

            if (labelStyle.step === 'auto') {
                if (labelStyle.count) {
                    labelStep = (this.maxY - this.minY) / labelStyle.count;
                }
            } else {
                labelStep = (this.maxY - this.minY) / labelStyle.step;
            }

            if (!labelStep) return

            const _drawReferencePoint = (x, y) => {
                if (labelStyle.line && labelStyle.referencePoint) {
                    drawDot(this.ctx, [x, y, 4], labelStyle.line);
                }
            };

            const _drawLabelValue = (val, x, y) => {
                if (labelStyle.showValue) {
                    const vw = textWidth(this.ctx, val, labelStyle.font);
                    textHeight(this.ctx, val, labelStyle.font);
                    const tx = x - vw - labelStyle.font.size/2 + labelStyle.shift.x;
                    const ty = y + labelStyle.shift.y;

                    this.ctx.save();

                    if (labelStyle.text.angle) {
                        const rx = x + vw/2 - Math.abs(labelStyle.text.angle/2) + labelStyle.shift.x, ry = y - labelStyle.font.size/2 + vw + labelStyle.shift.y;
                        this.ctx.translate(rx, ry);
                        this.ctx.rotate(labelStyle.text.angle * Math.PI / 180);
                        this.ctx.translate(-rx, -ry);
                    }

                    drawText(
                        this.ctx,
                        `${val}`, [tx, ty, 0],
                        labelStyle.text,
                        labelStyle.font
                    );

                    this.ctx.restore();
                }
            };

            const _drawLine = (i, x, y) => {
                if (labelStyle.line) {
                    if (i === this.minY && labelStyle.skipFirst) ; else {
                        const from = {x, y};
                        const to = {x: x + this.width, y};
                        drawVector(this.ctx, from, to, labelStyle.line); // line
                    }
                }
            };

            if (labelStyle.step === 'auto') {
                let labelValue = this.minY;
                let x = this.padding.left, vy = this.padding.top + this.height; this.padding.left + this.width;

                for (let i = 0; i <= labelStyle.count; i++) {
                    _drawLine(i, x, vy);
                    _drawReferencePoint(x, vy);
                    _drawLabelValue(o.onDrawLabelY(labelValue), x, vy);
                    labelValue += labelStep;
                    vy = (this.padding.top + this.height) - (labelValue - this.minY) * this.ratioY;
                }
            } else {
                let x = this.padding.left, vy = this.padding.top + this.height;

                let i = this.minY;
                while (i < this.maxY + 1) {
                    _drawLine(i, x, vy);
                    _drawReferencePoint(x, vy);
                    _drawLabelValue(o.onDrawLabelY(i), x, vy);
                    i += labelStep;
                    vy -= labelStep * this.ratioY;
                }
            }
        }
    };

    const AxisX = {
        drawLabelX(){
            const o = this.options;
            const labelStyle = o.labels.x;
            let labelStep = 0;

            if (labelStyle.step === 'auto') {
                if (labelStyle.count) {
                    labelStep = (this.maxX - this.minX) / labelStyle.count;
                }
            } else {
                labelStep = (this.maxX - this.minX) / labelStyle.step;
            }

            if (!labelStep) return

            const _drawReferencePoint = (x, y) => {
                if (labelStyle.line && labelStyle.referencePoint) {
                    drawDot(this.ctx, [x, y, 4], labelStyle.line);
                }
            };

            const _drawLabelValue = (val, x, y) => {
                if (labelStyle.showValue) {
                    const vw = textWidth(this.ctx, ""+val, labelStyle.font);
                    const vh = textHeight(this.ctx, ""+val, labelStyle.font);
                    const tx = x - vw / 2 + labelStyle.shift.x;
                    const ty = y + vh + labelStyle.font.size/2 + labelStyle.shift.y;

                    this.ctx.save();

                    if (labelStyle.text.angle) {
                        const rx = x + vw/2 - Math.abs(labelStyle.text.angle/2) + labelStyle.shift.x, ry = y - labelStyle.font.size/2 + vw + labelStyle.shift.y;
                        this.ctx.translate(rx, ry);
                        this.ctx.rotate(labelStyle.text.angle * Math.PI / 180);
                        this.ctx.translate(-rx + 100, -ry);
                    }

                    drawText(
                        this.ctx,
                        `${val}`, [tx, ty, 0],
                        labelStyle.text,
                        labelStyle.font
                    );

                    this.ctx.restore();
                }
            };

            const _drawLine = (i, x, y) => {
                if (labelStyle.line) {
                    if (i === this.minX && labelStyle.skipFirst) ; else {
                        const from = {x, y};
                        const to = {x, y: y + this.height};
                        drawVector(this.ctx, from, to, labelStyle.line); // line
                    }
                }
            };

            if (labelStyle.step === 'auto') {
                let labelValue = this.minX;
                let x = this.padding.left, vy = this.padding.top + this.height, ly = this.padding.top;

                for (let i = 0; i <= labelStyle.count; i++) {
                    _drawLine(i, x, ly);
                    _drawReferencePoint(x, vy);
                    _drawLabelValue(o.onDrawLabelX(labelValue), x, vy);
                    labelValue += labelStep;
                    x = (this.padding.left) + (labelValue - this.minX) * this.ratioX;
                    console.log(x, this.width + this.padding.left);
                }
            } else {
                let x = this.padding.left, vy = this.padding.top + this.height, ly = this.padding.top;

                let i = this.minX;

                while (i < this.maxX + 1) {
                    _drawLine(i, x, ly);
                    _drawReferencePoint(x, vy);
                    _drawLabelValue(o.onDrawLabelX(i), x, vy);

                    i += labelStep;
                    x += labelStep * this.ratioX;
                }
            }
        }
    };

    const Tooltip = {
        showTooltip(ctx, [mx, my], [x, y]){
            const o = this.options;

            this.removeTooltip();

            if (!this.data || !this.data.length) return

            let {font, shadow, border, padding, timeout} = o.tooltip;

            padding = normPadding(padding);

            const tooltip = document.createElement("div");

            tooltip.style.position = 'fixed';
            tooltip.style.border = `${border.width}px ${border.lineType} ${border.color}`;
            tooltip.style.borderRadius = `${border.radius}`;
            tooltip.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
            tooltip.style.background = `${o.tooltip.background}`;
            tooltip.style.font = `${font.style} ${font.weight} ${font.size}px/${font.lineHeight} ${font.family}`;
            tooltip.style.boxShadow = `${shadow.shiftX}px ${shadow.shiftY}px ${shadow.blur}px ${shadow.color}`;

            tooltip.innerHTML = o.onTooltipShow.apply(this, [x, y]);

            document.querySelector('body').appendChild(tooltip);

            tooltip.style.top = `${my - tooltip.clientHeight - 15}px`;
            tooltip.style.left = `${mx - tooltip.clientWidth / 2 - 5}px`;

            this.tooltip = tooltip;

            setTimeout(()=>{
                this.removeTooltip();
            }, timeout);
        },

        removeTooltip() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        }
    };

    const dotFunc = {
        drawCircle,
        drawSquare,
        drawTriangle,
        drawDiamond,
        drawDot
    };

    const lineFunc = {
        drawLine,
        drawCurve
    };

    class LineChart {
        constructor(data, options) {
            this.data = [...data];
            this.options = merge({}, defaultLineChartOptions, options);
            this.canvas = null;
            this.graphs = [];
            this.graphsNames = [];
            this.hiddenGraphs = [];
            this.coords = [];
            this.tooltip = null;
            this.minX = null;
            this.maxX = null;
            this.minY = null;
            this.maxY = null;
            this.title = this.options.title;

            const that = this;

            const o = this.options;

            const usedColors = [];
            let color, graphName;
            this.data.forEach((data, index) => {
                if (o.graphs[index]) {
                    const dot = merge({}, defaultDotStyle, o.dot, o.graphs[index].dot);
                    const line = merge({}, defaultLineStyle, o.line, o.graphs[index].line);
                    that.graphs.push(merge({}, defaultLineChartGraph, {dot, line}));
                    graphName = o.graphs[index].name || `line${index+1}`;
                } else {
                    graphName = `line${index+1}`;
                    if (index === 0) {
                        that.graphs.push(merge({}, defaultLineChartGraph, {dot: o.dot, line: o.line}));
                    } else {
                        do {
                            color = randomColor();
                        } while (usedColors.includes(color))
                        that.graphs.push(merge({}, defaultLineChartGraph, {dot: {...o.dot, color}, line: {...o.line, color}}));
                        usedColors.push(color);
                    }
                }
                that.graphsNames.push(graphName);
            });

            console.log(this.graphs);

            this.calcMinMax();
        }

        get [Symbol.toStringTag](){return "LineChart"}

        setSuperChart(chart){
            this.chart = chart;
            this.dpi = chart.options.dpi;
            this.ctx = chart.ctx;
            this.canvas = chart.canvas;
            this.padding = chart.padding;
            this.fullWidth = chart.viewWidth;
            this.fullHeight = chart.viewHeight;
            this.width = chart.viewWidth - (chart.padding.left + chart.padding.right);
            this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom);
            this.origin = chart.options.axis.origin;
            this.zero = chart.zero;
            this.proxy = chart.proxy;

            switch (this.origin){
                case ORIGIN_TOP_LEFT: {
                    this.zero = [this.padding.left, this.padding.top];
                    break
                }
                case ORIGIN_TOP_RIGHT: {
                    this.zero = [this.width + this.padding.left, this.padding.top];
                    break
                }
                case ORIGIN_BOTTOM_RIGHT: {
                    this.zero = [this.width + this.padding.left, this.height + this.padding.top];
                    break
                }
                // bottom-left
                default : {
                    this.zero = [this.padding.left, this.height + this.padding.top];
                    break
                }
            }

            this.calcRatio();
        }

        calcMinMax(){
            const o = this.options;
            let a = [];

            for (let d of this.data) {
                if (!Array.isArray(d)) continue
                for( const [x, y] of d) {
                    a.push([x, y]);
                }
            }

            const [minX, maxX] = minMax(a, 'x');
            const [minY, maxY] = minMax(a, 'y');

            this.minX = isNumber(o.boundaries.min.x) ? o.boundaries.min.x : minX;
            this.maxX = isNumber(o.boundaries.max.x) ? o.boundaries.max.x : maxX;
            this.minY = isNumber(o.boundaries.min.y) ? o.boundaries.min.y : minY;
            this.maxY = isNumber(o.boundaries.max.y) ? o.boundaries.max.y : maxY;

            if (isNaN(this.minX)) this.minX = 0;
            if (isNaN(this.maxX)) this.maxX = 100;
            if (isNaN(this.minY)) this.minX = 0;
            if (isNaN(this.maxY)) this.maxX = 100;
        }

        calcRatio(){
            this.ratioX = this.width / (this.maxX - this.minX);
            this.ratioY = this.height / (this.maxY - this.minY);
            // console.log(this.ratioX, this.ratioY)
        }

        #inView(x, y){
            const {left, top} = this.padding;
            const minX = left - 1;
            const maxX = left + this.width + 1;
            const minY = top - 1;
            const maxY = top + this.height + 1;

            return (x >= minX && x <= maxX) && (y >= minY && y <= maxY)
        }

        add(index, [x, y], shift = true){
            const o = this.options;
            const maxSize = o.maxGraphSize;

            if (maxSize) {
                while (this.data[index].length > maxSize - 1) {
                    this.data[index].shift();
                }
            }

            this.data[index].push([x, y]);

            this.minX = this.data[index][0][0];
            this.maxX = x;

            if (this.maxY < y) {
                this.maxY = y + y * (this.options.boundaries.increment / 100);
            }

            this.calcRatio();

            this.chart.resize();
        }

        hide(index){
            if (this.hiddenGraphs.includes(index)) {
                let idx = this.hiddenGraphs.indexOf(index);
                if (idx !== -1) {
                    this.hiddenGraphs.splice(idx, 1);
                }
            } else {
                this.hiddenGraphs.push(index);
            }
        }

        #toOrigin(x, y){
            const [zx, zy] = this.zero;
            let _x, _y;
            if (this.origin === ORIGIN_TOP_RIGHT) {
                _x = zx - Math.round((x - this.minX) * this.ratioX);
                _y = zy + Math.round((y - this.minY) * this.ratioY);
            }
            else if (this.origin === ORIGIN_TOP_LEFT) {
                _x = Math.round((x - this.minX) * this.ratioX) + zx;
                _y = Math.round((y - this.minY) * this.ratioY) + zy;
            }
            else if (this.origin === ORIGIN_BOTTOM_RIGHT) {
                _x = zx - Math.round((x - this.minX) * this.ratioX);
                _y = zy - Math.round((y - this.minY) * this.ratioY);
            }
            else if (this.origin === ORIGIN_BOTTOM_LEFT) {
                _x = Math.round((x - this.minX) * this.ratioX) + zx;
                _y = zy - Math.round((y - this.minY) * this.ratioY);
            }
            return [_x, _y]
        }

        drawGraph(){
            if (!this.data || !this.data.length) return

            const include = [];
            const ctx = this.ctx;
            const o = this.options;
            const [zx, zy] = this.zero;

            let index = 0;
            for(let data of this.data) {
                if (this.hiddenGraphs.includes(index)) continue

                const graphStyle = this.graphs[index];
                const dotStyle = graphStyle.dot;
                const lineStyle = graphStyle.line;

                if (!data.length) continue

                for(let i = 0; i < data.length; i++) {
                    let [x, y] = data[i];
                    let [_x, _y] = this.#toOrigin(x, y);

                    if (this.#inView(_x, _y)) {
                        include.push([_x, _y, x, y]);
                    }
                }

                if (include.length) {
                    if (graphStyle.line.fill && graphStyle.line.fill !== "transparent") {
                        let areaCoords = [];
                        let lastX = include[include.length - 1][0];

                        areaCoords.push([zx, zy, 0, 0]);
                        areaCoords = areaCoords.concat(include);
                        areaCoords.push([lastX, zy, 0, 0]);

                        drawArea(ctx, areaCoords, lineStyle);
                    }

                    if (o.lines) {
                        lineFunc[`draw${capitalize(lineStyle.type)}`](ctx, include, lineStyle);
                    }

                    if (o.dots) {
                        for (let [_x, _y, x, y] of include) {

                            // Draw point
                            if (dotStyle.color === 'random') {
                                dotStyle.color = randomColor();
                            }
                            if (dotStyle.fill === 'random') {
                                dotStyle.fill = randomColor();
                            }

                            dotFunc[`draw${capitalize(dotStyle.type)}`](ctx, [_x, _y, dotStyle.size], dotStyle);

                            // Draw value
                            if (o.values && o.values.show) {
                                let val, tw, th;
                                if (o.onDrawValue) {
                                    val = o.onDrawValue.apply(this, [x, y]);
                                } else {
                                    val = o.values.template.replace('x', x).replace('y', y);
                                }
                                tw = textWidth(this.ctx, val, o.values.font);
                                th = val.split("\n").length * o.values.font.size;
                                drawText(
                                    ctx,
                                    `${val}`, [_x - tw / 2 + o.values.shift.x, _y - th + o.values.shift.y, 0],
                                    o.values,
                                    o.values.font
                                );
                            }
                        }
                    }
                }

                this.coords[index] = include;
                index++;
            }
        }

        drawTooltip(){
            this.options;
            const ctx = this.ctx;
            const rect = this.canvas.getBoundingClientRect();
            const accuracy = 10;
            let tooltip = false;

            if (!this.data || !this.data.length) return
            if (!this.proxy.mouse) return

            let {x: mx, y: my} = this.proxy.mouse;
            let [_mx, _my] = [mx, my];

            mx = (mx - rect.left) * this.dpi;
            my = (my - rect.top) * this.dpi;

            let index = 0;
            for(let coordinates of this.coords) {
                for (const [px, py, x, y] of coordinates) {

                    // console.log(px, py)

                    const lx = px - accuracy, rx = px + accuracy;
                    const ly = py - accuracy, ry = py + accuracy;

                    if ((mx > lx && mx < rx) && (my > ly && my < ry)) {
                        drawCircle(ctx, [px, py, 10], this.graphs[index].dot);
                    }

                    if ((mx > lx && mx < rx) && (my > ly && my < ry)) {
                        this.showTooltip(ctx, [_mx, _my], [x, y], this.graphs[index].dot);
                        tooltip = true;
                    }
                }
                index++;
            }
            if (!tooltip && this.tooltip) {
                this.removeTooltip();
            }
        }

        drawLegend(){
            if (this.data.length === 0) return

            const o = this.options;
            const legend = {}, space = 10;

            for(let i = 0; i < this.graphs.length; i++) {
                const graph = this.graphs[i];
                const {dot} = graph;
                const {color, fill} = dot;
                const name = this.graphsNames[i];

                legend[name] = {
                    color,
                    fill
                };
            }

            if (o.legend.vertical === false) {
                let legendWidth = 0, offset = 0;
                for(let l in legend) {
                    legendWidth += textWidth(this.ctx, l) + space;
                }

                switch (o.legend.position) {
                    case 'left': {
                        offset = this.padding.left;
                        break
                    }
                    case 'right': {
                        offset = this.fullWidth - legendWidth * 2 - this.padding.right;
                        break
                    }
                    case 'center': {
                        offset = (this.fullWidth - legendWidth) / 2;
                        break
                    }
                }

                let i = 0;
                for (let l in legend) {
                    const y = this.fullHeight - 30;
                    const x = offset + i;
                    const w = textWidth(this.ctx, l, o.legend.font);
                    const n = o.onDrawLegend(l);
                    drawSquare(this.ctx, [x, y, 10], legend[l]);
                    drawText(this.ctx, n, [x + 20, y, w], {...legend[l], color: '#000'}, o.legend.font);
                    i += space;
                }

            }
        }

        drawLabelX(){}
        drawLabelY(){}
        showTooltip(){}
        removeTooltip(){}

        draw(){
            this.drawLabelX();
            this.drawLabelY();
            this.drawGraph();
            this.drawLegend();
            this.drawTooltip();
        }
    }

    Object.assign(LineChart.prototype, AxisX, AxisY, Tooltip);

    const defaultTextChartOptions = {
        ...defaultTextStyle,
        font: {
            ...defaultFontStyle
        },
        position: "default", // default (by x,y), top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    };

    class TextChart {
        constructor(text, [x, y], options) {
            this.text = text;
            this.lines = text.split("\n");
            this.options = merge({}, defaultTextChartOptions, options);
            this.canvas = null;
            this.w = 0;
            this.x = x;
            this.y = y;
        }

        get [Symbol.toStringTag](){return "TextChart"}

        setSuperChart(chart){
            this.chart = chart;
            this.ctx = chart.ctx;
            this.padding = chart.padding;
            this.fullWidth = chart.viewWidth;
            this.fullHeight = chart.viewHeight;
            this.width = chart.viewWidth - (chart.padding.left + chart.padding.right);
            this.height = chart.viewHeight - (chart.padding.top + chart.padding.bottom);
            this.dpi = chart.options.dpi;
            this.w = textWidth(this.ctx, this.text);
            this.h = this.lines.length * this.options.font.size * this.options.font.lineHeight;
        }

        draw(){
            const o = this.options;
            let x, y;
            switch (o.position) {
                case 'free': {
                    x = this.x;
                    y = this.y;
                    break
                }
                case TOP_LEFT: {
                    x = 0;
                    y = this.options.font.size;
                    break
                }
                case TOP_CENTER: {
                    x = this.fullWidth/2;
                    y = this.options.font.size;
                    this.options.align = 'center';
                    break
                }
                case TOP_RIGHT: {
                    x = this.fullWidth;
                    y = this.options.font.size;
                    this.options.align = 'right';
                    break
                }
                case BOTTOM_LEFT: {
                    x = 0;
                    y = this.fullHeight - this.h;
                    break
                }
                case BOTTOM_CENTER: {
                    x = this.fullWidth/2;
                    y = this.fullHeight - this.h;
                    this.options.align = 'center';
                    break
                }
                case BOTTOM_RIGHT: {
                    x = this.fullWidth;
                    y = this.fullHeight - this.h;
                    this.options.align = 'right';
                    break
                }
                default: {
                    [x, y] = [this.x, this.y];
                }
            }

            drawText(this.ctx, this.text,[x, y, this.w], this.options, this.options.font);
        }
    }

    globalThis.graph = {
        Chart, PointChart, LineChart, TextChart
    };

})();
