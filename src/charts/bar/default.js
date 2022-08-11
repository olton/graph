import {
    defaultFontStyle,
    defaultLabelStyleX,
    defaultLabelStyleY, defaultLegendStyle,
    defaultTooltip,
    defaultValueStyle
} from "../../defaults/index.js";

export const defaultBarChartOptions = {
    graphs: [],
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
        translate: [0, 0]
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
