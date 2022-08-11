import {normPadding} from "../helpers/padding.js";

export const Tooltip = {
    showTooltip(ctx, [mx, my], [x, y]){
        const o = this.options

        this.removeTooltip()

        if (!this.data || !this.data.length) return

        let {font, shadow, border, padding, timeout} = o.tooltip

        padding = normPadding(padding)

        const tooltip = document.createElement("div")

        tooltip.style.position = 'fixed'
        tooltip.style.border = `${border.width}px ${border.lineType} ${border.color}`
        tooltip.style.borderRadius = `${border.radius}`
        tooltip.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
        tooltip.style.background = `${o.tooltip.background}`
        tooltip.style.font = `${font.style} ${font.weight} ${font.size}px/${font.lineHeight} ${font.family}`
        tooltip.style.boxShadow = `${shadow.shiftX}px ${shadow.shiftY}px ${shadow.blur}px ${shadow.color}`

        tooltip.innerHTML = o.onTooltipShow.apply(this, [x, y])

        document.querySelector('body').appendChild(tooltip)

        tooltip.style.top = `${my - tooltip.clientHeight - 15}px`
        tooltip.style.left = `${mx - tooltip.clientWidth / 2 - 5}px`

        this.tooltip = tooltip

        setTimeout(()=>{
            this.removeTooltip()
        }, timeout)
    },

    removeTooltip() {
        if (this.tooltip) {
            this.tooltip.remove()
            this.tooltip = null
        }
    }
}