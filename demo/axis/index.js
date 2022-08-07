import {Chart, LineChart} from "../../src/index.js";
import {ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";

(() => {
    const rouse = []
    // const a = 10
    // for(let t = 0; t <= Math.PI * 2; t+=.01) {
    //     const r = Math.sin(a * t)
    //     const x = r * Math.cos(t)
    //     const y = r * Math.sin(t)
    //     rouse.push([x, y])
    // }

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
        // continue
        chartCanvas.add(new LineChart([], {
            boundaries: {
                min: {
                    x: -100,
                    y: -100
                },
                max: {
                    x: 100,
                    y: 100
                }
            },
            boundariesValues: {
                zero: true,
                zeroPoint: true
            },
            // values: false,
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