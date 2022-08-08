import {defaultFontStyle, defaultTextStyle} from "../../defaults/index.js";

export const defaultTextChartOptions = {
    ...defaultTextStyle,
    font: {
        ...defaultFontStyle
    },
    position: "default", // default (by x,y), top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
}