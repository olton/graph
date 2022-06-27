export const LINE_TYPE_LINE = 'line'
export const LINE_TYPE_CURVE = 'curve'
export const DOT_TYPE_DOT = 'dot'
export const DOT_TYPE_CIRCLE = 'circle'
export const DOT_TYPE_TRIANGLE = 'triangle'
export const DOT_TYPE_SQUARE = 'square'
export const DOT_TYPE_DIAMOND = 'diamond'
export const TEXT_ALIGN_CENTER = 'center'
export const TEXT_ALIGN_LEFT = 'left'
export const TEXT_ALIGN_RIGHT = 'right'
export const TEXT_TOP = 'text-top'
export const TEXT_BOTTOM = 'text-bottom'
export const TEXT_RIGHT = 'text-right'
export const TEXT_LEFT = 'text-left'

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

export const defaultTextStyle = {
    color: "#000",
    angle: 0,
    align: TEXT_ALIGN_LEFT,
    position: null,
    translate: [0,0]
}

export const defaultValueStyle = {
    ...defaultTextStyle,
    font: {
        ...defaultFontStyle
    },
    fixed: false,
    template: `[x, y]`,
    show: true
}
