import {Chart, LineChart} from "../../src/index.js";
import {ORIGIN_TOP_RIGHT} from "../../src/mixins/axis.js";

(() => {
    const parab = []
    const giperb = []

    for(let x = -50; x <= 50; x+=1) {
        parab.push([x, Math.pow(x, 2)])
        giperb.push([x, Math.pow(x, 3)])
    }

    const origins = {
        "center-center": {
            min: {
                x: -100,
                y: -100
            },
            max: {
                x: 100,
                y: 100
            }
        },
        "top-left": {
            min: {
                x: 0,
                y: -100
            },
            max: {
                x: 100,
                y: 0
            }
        },
        "top-right": {
            min: {
                x: -100,
                y: -100
            },
            max: {
                x: 0,
                y: 0
            }
        },
        "bottom-right": {
            min: {
                x: 0,
                y: -100
            },
            max: {
                x: 100,
                y: 0
            }
        },
        "bottom-left": {
            min: {
                x: 0,
                y: 0
            },
            max: {
                x: 100,
                y: 100
            }
        },
        "top-center": {
            min: {
                x: -100,
                y: -100
            },
            max: {
                x: 100,
                y: 0
            }
        },
        "bottom-center": {
            min: {
                x: -100,
                y: 0
            },
            max: {
                x: 100,
                y: 100
            }
        },
        "left-center": {
            min: {
                x: 0,
                y: -100
            },
            max: {
                x: 100,
                y: 100
            }
        },
        "right-center": {
            min: {
                x: -100,
                y: -100
            },
            max: {
                x: 0,
                y: 100
            }
        }
    }

    const container = document.querySelector("#charts")
    for(let origin in origins) {
        const chart = document.createElement("div")
        chart.setAttribute("id", `chart-${origin}`)
        chart.className = 'chart'
        container.append(chart)
        const chartCanvas = new Chart(`#chart-${origin}`, {
            dpi: 2,
            padding: "30, 20, 50, 40",
            cross: false,
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
        })
        chartCanvas.add(new LineChart([parab], {
            boundaries: origins[origin],
            values: false,
            lines: true,
            dot: {
                size: 2,
                color: "blue"
            }
        }))
        chartCanvas.add(new LineChart([giperb], {
            boundaries: origins[origin],
            values: false,
            lines: true,
            dot: {
                size: 2,
                color: "red"
            }
        }))
    }
})()