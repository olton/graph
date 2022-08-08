import {Chart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {random} from "../../src/helpers/rand.js";
import {ORIGIN_BOTTOM_LEFT, ORIGIN_BOTTOM_RIGHT, ORIGIN_TOP_LEFT, ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";
import {defaultTooltip} from "../../src/defaults/index.js";

const chart = new Chart("#chart1", {
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
    padding: 40
})


const graph1 = []
for(let x = 0; x <= 25; x++) {
    graph1.push([x * 4, Math.round(random(0, 100))])
}

console.log(graph1)

let line = new LineChart([graph1], {
    graphs: [
        {
            line: {
                type: "curve",
                size: 2,
                color: "red"
            },
            dot: {
                fill: "red",
                color: "darkRed",
                type: 'circle',
                size: 6
            }
        }
    ],
    boundaries: {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: 100,
            y: 100
        }
    },
    lines: true,
    origin: true,
    line: {
        color: "red"
    },
    values: {
        show: true,
        translate: [0, 0],
        font: {
            size: 20
        },
        template: `x,y`
    },
    maxGraphSize: 26,
    tooltip: {
        ...defaultTooltip,
        timeout: 10000
    },
    onDrawValue: (x, y) => {
        return `(${Math.round(x)}, ${Math.round(y)})`
    }
})

chart.add(line)
//
// let index = 100
// const interval = setInterval(()=>{
//     index+=4
//     const x = index
//     const y = random(0, 10)
//     line.add(0,[x, y])
//     // if (index > 112) clearInterval(interval)
// }, 1000)





