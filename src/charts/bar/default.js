import {
    defaultFontStyle,
    defaultLabelStyleX,
    defaultLabelStyleY, defaultLegendStyle,
    defaultTooltip,
    defaultValueStyle
} from "../../defaults/index.js";

export const defaultBarChartOptions = {
    graphs: {},
    groupDistance: 10,
    opacity: 0.9,
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
    onDrawValue: (v) => `${v}`,
    onDrawLabelX: (v) => `${v}`,
    onDrawLabelY: (v) => `${v}`,
    onDrawLegend: (v) => `${v}`,
}
