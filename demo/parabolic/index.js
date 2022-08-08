import {Chart} from "../../src/index.js"
import {PointChart} from "../../src/index.js";
import {
    ORIGIN_CENTER_CENTER,
} from "../../src/mixins/axis.js";
import {random} from "../../src/helpers/rand.js";

const chart1 = new Chart("#chart1", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "800px",
        height: "800px"
    },
    axis: {
        origin: ORIGIN_CENTER_CENTER,
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
    padding: 20
})

const chartData = []
const line1 = []

for(let x = -20; x <= 20; x+=0.01) {
    line1.push([x, Math.pow(x, 2)])
}
chartData.push(line1)

console.log(line1)

let line = new PointChart(chartData, {
    graphs: [
        {
            line: {
                type: "curve",
                size: 1,
                color: "violet"
            },
        }
    ],
    boundaries: {
        min: {
            x: -100,
            y: -100
        },
        max: {
            x: 100,
            y: 100
        }
    },
    lines: false,
    origin: true,
    dot: {
        fill: "rgba(0,0,0,.2)",
        type: 'circle',
        size: 1
    },
    values: false,
    maxGraphSize: 50
})

chart1.add(line)

