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
export const TOP_LEFT = 'top-left'
export const TOP_CENTER = 'top-center'
export const TOP_RIGHT = 'top-right'
export const BOTTOM_LEFT = 'bottom-left'
export const BOTTOM_CENTER = 'bottom-center'
export const BOTTOM_RIGHT = 'bottom-right'

export const defaultBoundaries = {
    min: {
        x: null,
        y: null
    },
    max: {
        x: null,
        y: null
    },
    increment: null
}

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
    translate: [0,0],
    baseline: "middle"
}

export const defaultValueStyle = {
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
}

export const defaultLineChartGraph = {
    dot: {
        ...defaultDotStyle
    },
    line: {
        ...defaultLineStyle
    }
}

export const defaultBorder = {
    width: 1,
    lineType: 'solid',
    color: '#ffc351',
    radius: 0
}

export const defaultTooltip = {
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
}

export const defaultLabelStyle = {
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
}

export const defaultLabelStyleX = {
    ...defaultLabelStyle,
    text: {
        ...defaultTextStyle,
        angle: 45,
    }
}

export const defaultLabelStyleY = {
    ...defaultLabelStyle
}

export const defaultLegendStyle = {
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
}

export const defaultTitleStyle = {
    text: "",
    position: TOP_LEFT,
    font: {
        ...defaultFontStyle,
        size: 24
    },
    style: {
        ...defaultTextStyle,
    },
}