import {
    defaultDotStyle,
    defaultLineStyle,
    defaultFontStyle,
    defaultValueStyle,
    defaultTooltip,
    defaultLabelStyleX,
    defaultLabelStyleY, defaultLegendStyle
} from "../../defaults/index.js";

export const defaultLineChartOptions = {
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
        ...defaultLineStyle,
        fill: "transparent"
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
}
