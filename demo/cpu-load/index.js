import {Chart, TextChart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {ORIGIN_BOTTOM_LEFT, ORIGIN_BOTTOM_RIGHT, ORIGIN_TOP_LEFT, ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";
import {defaultTooltip} from "../../src/defaults/index.js";
import {datetime} from "../../node_modules/@olton/datetime/src/index.js";

const chart = new Chart("#cpu", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "700px",
        height: "700px"
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
    padding: 40
})

const graph1 = []
let startX = datetime().addSecond(-100).time()
for (let i = 0; i < 10; i++) {
    startX+=1000
    graph1.push([startX, 0])
}

// console.log(graph1)

let line = new LineChart([graph1], {
    boundaries: {
        min: {
            x: graph1[0][0],
            y: 0
        },
        max: {
            x: graph1[graph1.length-1][0],
            y: 100
        }
    },
    lines: true,
    origin: true,
    line: {
        type: "line",
        color: "#3de3ff",
        fill: "rgba(51,178,255,0.2)"
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
        ...defaultTooltip
    },
    labels: {
        x: {
            text: {
                angle: 45,
            },
            step: "auto",
            count: 10
        },
        y: {
            step: "auto"
        }
    },
    legend: {
        position: "center",
        font: {
            size: 24
        }
    },
    onDrawValue: (x, y) => {
        return `(${Math.round(x)}, ${Math.round(y)})`
    },
    onDrawLabelX: v => {
        // console.log(v)
        return v
        // return `${v ? datetime(+v).format("HH:ss") : ''}`;
    }
})


chart.addChart(line)
// chart.setTitle(`Demo Graph\nLineChart with Area`, {
//     align: "center",
//     font: {
//         size: 32
//     }
// })
// chart.addChart(new TextChart(
//     `Copyright 2022 by Serhii Pimenov.\nAll Rights Reserver.`,
//     [0, 0],
//     {
//         ...defaultTextStyle,
//         position: 'bottom-right',
//         font: {
//             size: 15
//         }
//     }
// ))
//
// let index = 100
// const interval = setInterval(()=>{
//     index+=4
//     const x = index
//     const y = random(0, 10)
//     line.add(0,[x, y])
//     // if (index > 112) clearInterval(interval)
// }, 1000)





