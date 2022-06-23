import {Chart} from "../../src/index.js";

(() => {
    const container = document.querySelector("#charts")
    const origins = ["top-left", "top-right", "bottom-right", "bottom-left", "top-center", "bottom-center", "center-center", "left-center", "right-center"]
    for(let origin of origins) {
        const chart = document.createElement("div")
        chart.setAttribute("id", `chart-${origin}`)
        chart.className = 'chart'
        container.append(chart)
        new Chart(`#chart-${origin}`, {
            dpi: 2,
            arrows: {
                origin: origin,
                x: {
                    factor: 10
                },
                y: {
                    factor: 10
                },
            },
        })
    }
})()