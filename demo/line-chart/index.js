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
import {random} from "../../src/helpers/rand.js";

const chart1 = new Chart("#chart1", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "700px",
        height: "700px"
    },
    axis: {
        origin: ORIGIN_TOP_RIGHT,
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

// for(let i = 0; i <= 25; i++) {
//     const x = i*4
//     const y = random(20, 80)
//     line1.push([x, y])
// }

console.log(line1)

line1.push([100, 0])
// line1.push([-50, -50])
// line1.push([-10, 10])
// line1.push([10, 10])
// line1.push([50, 50])
// line1.push([100, 0])

chartData.push(line1)

let line = new LineChart(chartData, {
    graphs: [
        {
            line: {
                type: "curve",
                size: 4,
                color: "violet"
            }
        }
    ],
    boundaries: {
        min: {
            x: 200,
            y: -100
        },
        max: {
            x: 300,
            y: 100
        }
    },
    lines: true,
    origin: false,
    dot: {
        fill: "rgba(0,0,0,.2)",
        type: 'circle',
        size: 10
    },
    values: {
        show: false,
        shift: {
            x: 0,
            y: -10
        },
        font: {
            size: 20
        },
        template: `x,y`
    },
    maxGraphSize: 26
})

chart1.add(line)

// let index = 100
// setInterval(()=>{
//     index+=4
//     const x = index
//     const y = random(20, 80)
//     line.add(0,[x, y])
//     console.log(x, y)
// }, 1000)




