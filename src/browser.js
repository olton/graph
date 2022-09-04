import {Chart} from "./core/index.js"
import {PointChart} from "./charts/point/index.js"
import {LineChart} from "./charts/line/index.js";
import {TextChart} from "./charts/text/chart-text.js";

globalThis.graph = {
    Chart, PointChart, LineChart, TextChart
}