import {
    defaultDotStyle,
    defaultLineStyle,
    defaultFontStyle,
    defaultValueStyle,
    defaultTooltip,
    defaultLabelStyleX,
    defaultLabelStyleY,
    defaultLegendStyle,
    defaultBoundaries,
    defaultTextStyle,
    TOP_LEFT
} from "../../defaults/index.js";

export const defaultLineChartOptions = {
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
}
