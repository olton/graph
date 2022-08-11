import {Chart, TextChart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {ORIGIN_BOTTOM_LEFT, ORIGIN_BOTTOM_RIGHT, ORIGIN_TOP_LEFT, ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";
import {defaultTooltip} from "../../src/defaults/index.js";
import {datetime} from "../../node_modules/@olton/datetime/src/index.js";
import {random} from "../../src/helpers/rand.js";

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
    padding: `50, 50, 50, 50`
})

const inter = 26
const graph1 = []
let startX = datetime().addSecond(-inter).time()
for (let i = 0; i < inter; i++) {
    startX = datetime(startX).addSecond(1).time()
    graph1.push([startX, Math.round(random(20, 60))])
}

// console.log(graph1)

let line = new LineChart([graph1], {
    boundaries: {
        min: {
            y: 0
        },
        max: {
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
                angle: 0,
            },
            step: "auto",
            count: 5
        },
        y: {
            text: {
                angle: 0,
            },
            step: 10,
            count: 5
        }
    },
    legend: {
        position: "center",
        font: {
            size: 24
        }
    },
    onDrawValue: (x, y) => {
        const _x = (+x).toFixed(0)
        const _y = (+y).toFixed(0)
        return `${_y}`
    },
    onDrawLabelX: v => {
        return `${datetime(+v).format("hh:mm:ss")}`
    }
})

chart.addChart(line)

const interval = setInterval(()=>{
    const x = datetime().time()
    const y = random(20, 80)
    line.add(0,[x, y])
}, 1000)





