import {Chart} from "../../src/index.js";
import {ORIGIN_BOTTOM_LEFT} from "../../src/mixins/axis.js";
import {TEXT_TOP} from "../../src/defaults/index.js";
import {BarChart} from "../../src/charts/bar/index.js";

const chart = new Chart("#chart", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "700px",
        height: "400px"
    },
    axis: {
        origin: ORIGIN_BOTTOM_LEFT,
    },
    cross: {
    },
    grid: {
        h: {
            count: 20,
        },
        v: {
            count: 20,
        }
    },
    padding: `50, 50, 70, 50`,
    title: {
        text: "Bar Chart\nGraph System for Metro 5 Demo",
        position: TEXT_TOP,
        font: {
            size: 32
        },
        style: {
            align: "center"
        }
    }
})

const data1 = [8,7,5,9,2]

const bar = new BarChart(data1, {
    graphs: {
        "Austin": "#0d5",
        "Denver": "#fb0",
        "Washington": "#ad2a14",
        "Kyiv": "#07f",
        "Moscow": "#f08",
    },
    boundaries: {
        max: 10
    }
})

chart.addChart(bar)