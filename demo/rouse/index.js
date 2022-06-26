import {Chart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {
    ORIGIN_BOTTOM_CENTER,
    ORIGIN_CENTER_CENTER,
} from "../../src/mixins/axis.js";

const axis = {
    style: {
        size: 4,
        factor: 20,
        subFactor: 4
    }
}

const chart1 = new Chart("#chart1", {
    dpi: 2,
    css: {
        border: "1px solid #ddd",
        width: "800px",
        height: "800px"
    },
    axis: {
        origin: ORIGIN_CENTER_CENTER,
        x: {
            ...axis
        },
        y: {
            ...axis
        }
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

const rouse = []
const a = 10
for(let t = 0; t <= Math.PI * 2; t+=.01) {
    const r = Math.sin(a * t)
    const x = r * Math.cos(t)
    const y = r * Math.sin(t)
    rouse.push([x, y])
}

let line = new LineChart([rouse], {
    boundaries: {
        min: {
            x: -1,
            y: -1
        },
        max: {
            x: 1,
            y: 1
        }
    },
    values: false,
    dot: {
        size: 1,
        color: "#ff0000"
    },
    line: {
        color: "#ff0000"
    }
})

chart1.add(line)

