import {defaultDotStyle, defaultLineStyle, defaultFontStyle, defaultValueStyle} from "../../defaults/index.js";

export const defaultPointChartOptions = {
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
}
