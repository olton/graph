export const normPadding = (p, d = 1) => {
    let [top, right, bottom, left] = [0,0,0,0]

    if (typeof p === 'number') {
        [top, right, bottom, left] = [p,p,p,p]
    }

    else if (typeof p === 'string') {
        [top, right, bottom, left] = p.split(",").map(v => v.trim())
    }

    return {
        top: top * d,
        left: left * d,
        right: right * d,
        bottom: bottom * d
    }
}