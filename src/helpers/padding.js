export const normPadding = (p, d = 1) => {
    let [top, right, bottom, left] = [0,0,0,0]

    if (typeof p === 'number' || !isNaN(p)) {
        [top, right, bottom, left] = [+p,+p,+p,+p]
    }

    else if (typeof p === 'string') {
        [top = 0, right = 0, bottom = 0, left = 0] = p.split(",").map(v => v.trim())
    }

    else if (typeof p === "object") {
        top = p.top ? p.top : 0
        left = p.left ? p.left : 0
        right = p.right ? p.right : 0
        bottom = p.bottom ? p.bottom : 0
    }

    return {
        top: top * d,
        left: left * d,
        right: right * d,
        bottom: bottom * d
    }
}