import {dashedName} from "./dashed-name.js";

export const css = (el, style) => {
    for(let prop in style) {
        if (el.style.hasOwnProperty(prop)) {
            el.style[prop] = style[prop]
        }
    }
}

export const cssProp = (el, prop, type) => {
    const val = window.getComputedStyle(el).getPropertyValue(dashedName(prop))

    switch (type) {
        case 'string': return val
        case 'float': return parseFloat(val)
        case 'array': return val.split(" ")
        default: return parseInt(val)
    }
}
