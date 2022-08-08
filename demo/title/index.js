import {Chart} from "../../src/index.js"
import {PointChart} from "../../src/index.js";
import {
    ORIGIN_BOTTOM_CENTER,
    ORIGIN_CENTER_CENTER, ORIGIN_TOP_LEFT,
} from "../../src/mixins/axis.js";
import {defaultTextStyle, TEXT_BOTTOM, TEXT_TOP} from "../../src/defaults/index.js";

const axis = {
    style: {
        size: 4,
        factor: 20,
        subFactor: 4
    }
}

const chart = new Chart("#chart", {
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
    padding: "50,20,20,20",
    title: {
        text: "Polar Rouse\nGraph System for Metro 5 Demo",
        position: TEXT_TOP,
        align: "center",
        font: {
            size: 32
        },
        translate: [0,0],
    }
})

const rouse = []
const a = 10
for(let t = 0; t <= Math.PI * 2; t+=.01) {
    const r = Math.sin(a * t)
    const x = r * Math.cos(t)
    const y = r * Math.sin(t)
    rouse.push([x, y])
}


let line = new PointChart([rouse], {
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

// chart.addChart(line)

const ch = document.querySelector("#chart")
ch.addEventListener("click", ()=>{
    chart.saveAs()
})

chart.addText(`Gloriatur bibendum venenatis nisi\nquis dico posidonium`, [900, 100], {...defaultTextStyle, color: "green"})