import {Chart, LineChart} from "../../src/index.js";
import {ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";

(() => {
    const chartData = []
    const line1 = []

    line1.push([-10, 10])
    line1.push([-10, -10])
    line1.push([10, 10])
    line1.push([10, -10])
    // line1.push([20, 5])
    // line1.push([20, -15])

    chartData.push(line1)

    const container = document.querySelector("#charts")
    const origins = ["center-center", "top-left", "top-right", "bottom-right", "bottom-left", "top-center", "bottom-center", "left-center", "right-center"]
    for(let origin of origins) {
        const chart = document.createElement("div")
        chart.setAttribute("id", `chart-${origin}`)
        chart.className = 'chart'
        container.append(chart)
        new Chart(`#chart-${origin}`, {
            dpi: 2,
            padding: "30, 20, 50, 40",
            axis: {
                origin: origin
            },
            grid: {
                h: {
                    count: 20
                },
                v: {
                    count: 20
                }
            }
        }).add(new LineChart(chartData, {
            values: false,
            lines: false,
            dot: {
                size: 4
            }
        }))
    }
})()