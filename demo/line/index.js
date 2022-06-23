import {Chart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {
    ORIGIN_BOTTOM_CENTER,
    ORIGIN_BOTTOM_LEFT,
    ORIGIN_BOTTOM_RIGHT,
    ORIGIN_CENTER_CENTER,
    ORIGIN_LEFT_CENTER,
    ORIGIN_RIGHT_CENTER,
    ORIGIN_TOP_CENTER,
    ORIGIN_TOP_LEFT,
    ORIGIN_TOP_RIGHT
} from "../../src/mixins/axis.js";

const chart1 = new Chart("#chart1", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "600px",
        height: "400px"
    },
    axis: {
        origin: ORIGIN_CENTER_CENTER
    }
})

const chart2 = new Chart("#chart2", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "600px",
        height: "400px"
    },
    axis: {
        origin: ORIGIN_TOP_RIGHT
    }
})

const chartData = []
const line1 = []

line1.push([-10, 10])
line1.push([-10, -10])
line1.push([10, 10])
line1.push([20, 5])
line1.push([20, -15])

chartData.push(line1)

chart1.add(new LineChart(chartData, {
    boundaries: {
        max: {
            x: 100,
            y: 100
        },
        increment: 0
    },
    lines: false,
    dot: {
        fill: "rgba(0,0,0,.2)",
        color: "#ccc",
        type: 'diamond'
    },
    values: {
        shift: {
            x: 0,
            y: -10
        }
    },
}))

chart2.add(new LineChart(chartData, {
    boundaries: {
        max: {
            x: 100,
            y: 100
        },
        increment: 0
    },
    lines: false,
    dot: {
        fill: "rgba(0,0,0,.2)",
        color: "#ccc",
        type: 'diamond'
    },
    values: {
        shift: {
            x: 0,
            y: -10
        }
    },
}))


