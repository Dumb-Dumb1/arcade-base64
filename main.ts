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
        let out2 = ""
        let j = 0
        while (j < dat.length) {
            const x12 = _c.indexOf(dat.charAt(j++))
            const x22 = _c.indexOf(dat.charAt(j++))
            const x32 = _c.indexOf(dat.charAt(j++))
            const x42 = _c.indexOf(dat.charAt(j++))
            const r1 = (x12 << 2) | (x22 >> 4)
            const r2 = ((x22 & 15) << 4) | (x32 >> 2)
            const r3 = ((x32 & 3) << 6) | x42
            out2 += String.fromCharCode(r1)
            if (x32 != 64) out2 += String.fromCharCode(r2)
            if (x42 != 64) out2 += String.fromCharCode(r3)
        }
        return out2
    }

    /**
     * Caesar cipher encryption
     */
    //% block="encrypt %txt with Caesar cipher shift %shift"
    export function caesarEncrypt(txt: string, shift: number): string {
        let out3 = ""
        shift = shift % 26
        if (shift < 0) shift += 26  // ensure positive shift
        for (let k = 0; k < txt.length; k++) {
            let c = txt.charCodeAt(k)
            if (c >= 65 && c <= 90) { // uppercase
                out3 += String.fromCharCode((c - 65 + shift) % 26 + 65)
            } else if (c >= 97 && c <= 122) { // lowercase
                out3 += String.fromCharCode((c - 97 + shift) % 26 + 97)
            } else { // other characters
                out3 += txt.charAt(k)
            }
        }
        return out3
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
        let out4 = ""
        for (let l = 0; l < txt.length; l++) {
            const d = txt.charCodeAt(l)
            const m = key.charCodeAt(l % key.length)
            out4 += String.fromCharCode(d ^ m)
        }
        return out4
    }

    /**
     * Validates substitution key requirements
     */
    function validateSubstitutionKey(key: string): void {
        // Check length
        if (key.length !== 26) {
            control.fail("Key must be exactly 26 letters long");
        }

        // Check all characters are uppercase letters
        for (let n = 0; n < key.length; n++) {
            const char = key.charAt(n);
            if (char < "A" || char > "Z") {
                control.fail("Key must contain only uppercase letters (A-Z)");
            }
        }

        // Check for duplicates
        for (let o = 0; o < key.length; o++) {
            for (let p = o + 1; p < key.length; p++) {
                if (key.charAt(o) === key.charAt(p)) {
                    control.fail("Key must not contain duplicate letters");
                }
            }
        }
    }

    /**
     * Generate a random substitution key
     */
    //% block="generate substitution key"
    export function generateSubstitutionKey(): string {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let key = "";
        let available = letters.split("");

        // Fisher-Yates shuffle algorithm
        for (let q = available.length - 1; q > 0; q--) {
            const r = Math.floor(Math.random() * (q + 1));
            // Swap elements
            [available[q], available[r]] = [available[r], available[q]];
        }

        key = available.join("");
        return key;
    }

    /**
     * Simple substitution cipher encryption
     */
    //% block="encrypt %txt with substitution key %key"
    export function substitutionEncrypt(txt: string, key: string): string {
        validateSubstitutionKey(key);

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const fullKey = key + key.toLowerCase(); // Create 52-char key
        let out5 = "";

        for (let s = 0; s < txt.length; s++) {
            const e = txt.charAt(s);
            const idx = alphabet.indexOf(e);

            if (idx >= 0) {
                out5 += fullKey.charAt(idx);
            } else {
                out5 += e; // Non-alphabet characters unchanged
            }
        }
        return out5;
    }

    /**
     * Simple substitution cipher decryption
     */
    //% block="decrypt %txt with substitution key %key"
    export function substitutionDecrypt(txt: string, key: string): string {
        validateSubstitutionKey(key);

        const alphabet2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const fullKey2 = key + key.toLowerCase();
        let out6 = "";

        for (let t = 0; t < txt.length; t++) {
            const f = txt.charAt(t);
            const idx2 = fullKey2.indexOf(f);

            if (idx2 >= 0) {
                out6 += alphabet2.charAt(idx2);
            } else {
                out6 += f; // Non-alphabet characters unchanged
            }
        }
        return out6;
    }

    /**
     * Reverse cipher encryption/decryption
     */
    //% block="reverse %txt"
    export function reverseCipher(txt: string): string {
        let out7 = ""
        for (let u = txt.length - 1; u >= 0; u--) {
            out7 += txt.charAt(u)
        }
        return out7
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
        const alphabet3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const reverse = "ZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba"
        let out8 = ""
        for (let v = 0; v < txt.length; v++) {
            const g = txt.charAt(v)
            const idx3 = alphabet3.indexOf(g)
            if (idx3 >= 0) {
                out8 += reverse.charAt(idx3)
            } else {
                out8 += g
            }
        }
        return out8
    }
}
