import {
    defaultFontStyle,
    defaultLabelStyleX,
    defaultLabelStyleY, defaultLegendStyle, defaultTextStyle,
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
            ...defaultLabelStyleX,
            text: {
                ...defaultTextStyle,
                angle: 0
            }
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
    boundaries: {
        min: null,
        max: null
    },
    dataAxis: 'y',
    rect: 'default',
    onTooltipShow: (x, y) => `${x}: ${y}`,
    onDrawValue: (v) => `${v}`,
    onDrawLabelX: (v) => `${v}`,
    onDrawLabelY: (v) => `${v}`,
    onDrawLegend: (v) => `${v}`,
}
