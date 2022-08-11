import {merge} from "../../helpers/merge.js";
import {defaultBarChartOptions} from "./default.js";

export class Bar {
    constructor(data, options) {
        this.options = merge({}, defaultBarChartOptions, options)

    }

}