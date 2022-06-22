import {LineChartDefaultOptions} from "./default.js"

export class LineChart {
    constructor(data, options = LineChartDefaultOptions) {
        this.data = data
    }

    draw(){

    }
}

export const lineChart = (...args) => new LineChart(...args)