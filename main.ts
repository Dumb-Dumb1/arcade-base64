namespace u8x3 {
    // our "alphabet" stays the same
    const _c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * Opaque "encode" function
     */
    //% block="encrypt %txt"
    export function e1(txt: string): string {
        let out = ""
        let i = 0
        while (i < txt.length) {
            const c1 = txt.charCodeAt(i++)
            const c2 = i < txt.length ? txt.charCodeAt(i++) : NaN
            const c3 = i < txt.length ? txt.charCodeAt(i++) : NaN
            const x1 = c1 >> 2
            const x2 = ((c1 & 3) << 4) | (c2 >> 4)
            const x3 = ((c2 & 15) << 2) | (c3 >> 6)
            const x4 = c3 & 63
            if (isNaN(c2)) {
                out += _c.charAt(x1) + _c.charAt(x2) + "=="
            } else if (isNaN(c3)) {
                out += _c.charAt(x1) + _c.charAt(x2) + _c.charAt(x3) + "="
            } else {
                out += _c.charAt(x1) + _c.charAt(x2) + _c.charAt(x3) + _c.charAt(x4)
            }
        }
        return out
    }

    /**
     * Opaque "decode" function
     */
    //% block="decrypt %dat"
    export function d2(dat: string): string {
        // strip any invalid
        let clean = ""
        for (let ch of dat) {
            if (_c.indexOf(ch) >= 0 || ch == "=") clean += ch
        }
        dat = clean

        let out = ""
        let i = 0
        while (i < dat.length) {
            const x1 = _c.indexOf(dat.charAt(i++))
            const x2 = _c.indexOf(dat.charAt(i++))
            const x3 = _c.indexOf(dat.charAt(i++))
            const x4 = _c.indexOf(dat.charAt(i++))
            const r1 = (x1 << 2) | (x2 >> 4)
            const r2 = ((x2 & 15) << 4) | (x3 >> 2)
            const r3 = ((x3 & 3) << 6) | x4
            out += String.fromCharCode(r1)
            if (x3 != 64) out += String.fromCharCode(r2)
            if (x4 != 64) out += String.fromCharCode(r3)
        }
        return out
    }
}