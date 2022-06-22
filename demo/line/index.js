import {Chart} from "../../src/index.js"
import {LineChart} from "../../src/index.js"
import {ORIGIN_BOTTOM_LEFT, ORIGIN_CENTER_CENTER, ORIGIN_TOP_LEFT} from "../../src/mixins/arrows.js";

const chart = new Chart("#chart", {
    dpi: 2,
    css: {
        border: "0px solid #ddd",
        width: "800px",
        height: "600px"
    },
    grid: {},
    arrows: {
        origin: ORIGIN_BOTTOM_LEFT
    },
    cross: {},
})

chart.add(new LineChart([]))