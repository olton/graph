import {Chart} from "../../src/index.js"
import {defaultTextStyle, TEXT_TOP} from "../../src/defaults/index.js";
import {TextChart} from "../../src/charts/text/chart-text.js";

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
        origin: false,
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
    padding: 0,
    title: false
})

const text = new TextChart(
    `Copyright 2022 by Serhii Pimenov.\nAll Rights Reserver.`,
    [0, 10],
    {
        ...defaultTextStyle,
        position: 'v-top-left',
        font: {
            size: 24
        }
    }
)

chart.addChart(text)