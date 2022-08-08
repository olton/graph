export const textWidth = (ctx, text) => {
    const lines = text.toString().split('\n')
    let tw = 0
    for(let line of lines) {
        const _w = ctx.measureText(text).width
        if (_w > tw) tw = _w
    }
    return tw
}