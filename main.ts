namespace u8x3 {
    // our "alphabet" stays the same
    const _c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * Opaque "encode" function (Base64)
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
     * Opaque "decode" function (Base64)
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

    /**
     * Caesar cipher encryption
     */
    //% block="encrypt %txt with Caesar cipher shift %shift"
    export function caesarEncrypt(txt: string, shift: number): string {
        let out = ""
        shift = shift % 26
        if (shift < 0) shift += 26  // ensure positive shift
        for (let i = 0; i < txt.length; i++) {
            let c = txt.charCodeAt(i)
            if (c >= 65 && c <= 90) { // uppercase
                out += String.fromCharCode((c - 65 + shift) % 26 + 65)
            } else if (c >= 97 && c <= 122) { // lowercase
                out += String.fromCharCode((c - 97 + shift) % 26 + 97)
            } else { // other characters
                out += txt.charAt(i)
            }
        }
        return out
    }

    /**
     * Caesar cipher decryption
     */
    //% block="decrypt %txt with Caesar cipher shift %shift"
    export function caesarDecrypt(txt: string, shift: number): string {
        // decryption is just encryption with negative shift
        return caesarEncrypt(txt, -shift)
    }

    /**
     * XOR cipher encryption/decryption
     */
    //% block="apply XOR cipher to %txt with key %key"
    export function xorCipher(txt: string, key: string): string {
        let out = ""
        for (let i = 0; i < txt.length; i++) {
            const c = txt.charCodeAt(i)
            const k = key.charCodeAt(i % key.length)
            out += String.fromCharCode(c ^ k)
        }
        return out
    }

    /**
     * Simple substitution cipher encryption
     */
    //% block="encrypt %txt with substitution key %key"
    export function substitutionEncrypt(txt: string, key: string): string {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        // Ensure key is at least as long as alphabet
        while (key.length < alphabet.length) {
            key += key
        }
        let out = ""
        for (let i = 0; i < txt.length; i++) {
            const c = txt.charAt(i)
            const idx = alphabet.indexOf(c)
            if (idx >= 0 && idx < key.length) {
                out += key.charAt(idx)
            } else {
                out += c
            }
        }
        return out
    }

    /**
     * Simple substitution cipher decryption
     */
    //% block="decrypt %txt with substitution key %key"
    export function substitutionDecrypt(txt: string, key: string): string {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        // Ensure key is at least as long as alphabet
        while (key.length < alphabet.length) {
            key += key
        }
        let out = ""
        for (let i = 0; i < txt.length; i++) {
            const c = txt.charAt(i)
            const idx = key.indexOf(c)
            if (idx >= 0 && idx < alphabet.length) {
                out += alphabet.charAt(idx)
            } else {
                out += c
            }
        }
        return out
    }

    /**
     * Reverse cipher encryption/decryption
     */
    //% block="reverse %txt"
    export function reverseCipher(txt: string): string {
        let out = ""
        for (let i = txt.length - 1; i >= 0; i--) {
            out += txt.charAt(i)
        }
        return out
    }

    /**
     * ROT13 encryption/decryption
     */
    //% block="apply ROT13 to %txt"
    export function rot13(txt: string): string {
        // ROT13 is a special case of Caesar cipher with shift 13
        return caesarEncrypt(txt, 13)
    }

    /**
     * Atbash cipher encryption/decryption
     */
    //% block="apply Atbash cipher to %txt"
    export function atbash(txt: string): string {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const reverse = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba"
        let out = ""
        for (let i = 0; i < txt.length; i++) {
            const c = txt.charAt(i)
            const idx = alphabet.indexOf(c)
            if (idx >= 0) {
                out += reverse.charAt(idx)
            } else {
                out += c
            }
        }
        return out
    }
}