import {Chart, LineChart} from "../../src/index.js";
import {ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";

(() => {
    const rouse = []
    const a = 10
    for(let t = 0; t <= Math.PI * 2; t+=.01) {
        const r = Math.sin(a * t)
        const x = r * Math.cos(t)
        const y = r * Math.sin(t)
        rouse.push([x, y])
    }

    const originsArray = ["center-center", "top-left", "top-right", "bottom-right", "bottom-left", "top-center", "bottom-center", "left-center", "right-center"]
    const graphColor = {
        size: 1,
        color: "#ff0000"
    }

    const container = document.querySelector("#charts")
    for(let origin of originsArray) {
        const chart = document.createElement("div")
        chart.setAttribute("id", `chart-${origin}`)
        chart.className = 'chart'
        container.append(chart)
        const chartCanvas = new Chart(`#chart-${origin}`, {
            dpi: 2,
            padding: "10",
            cross: false,
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
        chartCanvas.add(new LineChart([rouse], {
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
            lines: true,
            dot: {
                ...graphColor
            },
            line: {
                ...graphColor,
                type: "line"
            }
        }))
    }
})()