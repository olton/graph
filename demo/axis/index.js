import {Chart, PointChart} from "../../src/index.js";
import {ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";
import {random} from "../../src/helpers/rand.js";

globalThis.charts = [];

(() => {
    const rouse = []
    const a = 2
    for(let t = 0; t <= Math.PI * 2; t+=.01) {
        const r = Math.sin(a * t)
        const x = r * Math.cos(t)
        const y = r * Math.sin(t)
        rouse.push([x, y])
    }

    const originsArray = ["center-center", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right", "left-center", "right-center"]
    const graphColor = {
        size: 1,
        color: "#ff0000"
    }

    const container = document.querySelector("#charts")
    for(let origin of originsArray) {
        // console.log(origin)

        const chart = document.createElement("div")
        chart.setAttribute("id", `chart-${origin}`)
        chart.className = 'chart'
        container.append(chart)
        const chartCanvas = new Chart(`#chart-${origin}`, {
            dpi: 2,
            padding: "10",
            cross: false,
            css: {
                border: "1px solid #ddd",
                width: "300px",
                height: "300px"
            },
            axis: {
                origin: origin,
                x: {
                    style: {
                        size: 2
                    }
                },
                y: {
                    style: {
                        size: 2
                    }
                }
            },
            grid: {
                h: {
                    count: 20
                },
                v: {
                    count: 20
                }
            }
        })

        globalThis.charts.push(chartCanvas)

        // continue
        chartCanvas.addChart(new PointChart([rouse], {
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
            lines: false,
            values: false,
            dot: {
                ...graphColor,
                color: "red",
                size: 4
            },
            line: {
                ...graphColor,
                type: "line",
            },
            maxGraphSize: 10
        }))
    }
})()

globalThis.addPoint = () => {
    const graph = globalThis.charts[0].charts[0]
    graph.add(0, [random(-100, 100), random(-100, 100)])
}