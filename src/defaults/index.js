export const LINE_TYPE_LINE = 'line'
export const LINE_TYPE_CURVE = 'curve'
export const DOT_TYPE_DOT = 'dot'
export const DOT_TYPE_CIRCLE = 'circle'
export const DOT_TYPE_TRIANGLE = 'triangle'
export const DOT_TYPE_SQUARE = 'square'
export const DOT_TYPE_DIAMOND = 'diamond'

export const defaultDotStyle = {
    type: DOT_TYPE_DOT,
    size: 1,
    color: "#000",
    fill: "#000",
    dash: []
}

export const defaultLineStyle = {
    color: "#000",
    dash: [],
    size: 1,
    type: LINE_TYPE_LINE
}

export const defaultFontStyle = {
    style: 'normal',
    weight: 'normal',
    size: 16,
    lineHeight: 1,
    family: 'sans-serif'
}

export const defaultLabelStyle = {
    color: '#000',
    font: {
        ...defaultFontStyle
    },
    count: 5,
    fixed: false,
    opposite: false,
    angle: 0,
    align: 'center',
    shift: {
        x: 0,
        y: 0
    },
    skip: 0,
    showLine: true,
    showLabel: true,
    showMin: true,
    step: "auto"
}

export const defaultValueStyle = {
    color: '#000',
    font: {
        ...defaultFontStyle
    },
    fixed: false,
    angle: 0,
    align: 'center',
    shift: {
        x: 0,
        y: 0
    },
    template: `[x, y]`,
    show: true
}
