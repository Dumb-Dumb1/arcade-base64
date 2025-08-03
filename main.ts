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

            // Handle potential invalid characters
            if (isNaN(c1)) continue

            const x1 = c1 >> 2
            const x2 = ((c1 & 3) << 4) | (isNaN(c2) ? 0 : (c2 >> 4))
            const x3 = isNaN(c2) ? 0 : ((c2 & 15) << 2) | (isNaN(c3) ? 0 : (c3 >> 6))
            const x4 = isNaN(c3) ? 0 : (c3 & 63)

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
     * Opaque "decode" function (Base64) - FIXED VERSION
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
            // Get the next 4 characters
            const c1 = dat.charAt(i++)
            const c2 = dat.charAt(i++)
            const c3 = dat.charAt(i++)
            const c4 = dat.charAt(i++)

            // If we don't have 4 characters, break
            if (c1 === undefined || c2 === undefined || c3 === undefined || c4 === undefined) {
                break
            }

            // Get indices for the first two characters (must be valid)
            const x1 = _c.indexOf(c1)
            const x2 = _c.indexOf(c2)

            // If the first two are invalid, skip this group
            if (x1 < 0 || x2 < 0) {
                continue
            }

            // Check for padding in the third character
            if (c3 === '=') {
                // Then the fourth must also be '=' (we have one byte)
                const r1 = (x1 << 2) | (x2 >> 4)
                out += String.fromCharCode(r1)
                continue
            }

            // Get the index for the third character
            const x3 = _c.indexOf(c3)
            if (x3 < 0) {
                continue
            }

            // Check for padding in the fourth character
            if (c4 === '=') {
                // We have two bytes
                const r1 = (x1 << 2) | (x2 >> 4)
                const r2 = ((x2 & 15) << 4) | (x3 >> 2)
                out += String.fromCharCode(r1)
                out += String.fromCharCode(r2)
                continue
            }

            // Get the index for the fourth character
            const x4 = _c.indexOf(c4)
            if (x4 < 0) {
                continue
            }

            // We have three bytes
            const r1 = (x1 << 2) | (x2 >> 4)
            const r2 = ((x2 & 15) << 4) | (x3 >> 2)
            const r3 = ((x3 & 3) << 6) | x4
            out += String.fromCharCode(r1)
            out += String.fromCharCode(r2)
            out += String.fromCharCode(r3)
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
     * Validates substitution key requirements
     */
    function validateSubstitutionKey(key: string): void {
        // Check length
        if (key.length !== 26) {
            control.fail("Key must be exactly 26 letters long");
        }

        // Check all characters are uppercase letters
        for (let i = 0; i < key.length; i++) {
            const char = key.charAt(i);
            if (char < "A" || char > "Z") {
                control.fail("Key must contain only uppercase letters (A-Z)");
            }
        }

        // Check for duplicates
        for (let i = 0; i < key.length; i++) {
            for (let j = i + 1; j < key.length; j++) {
                if (key.charAt(i) === key.charAt(j)) {
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
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements
            [available[i], available[j]] = [available[j], available[i]];
        }

        key = available.join("");
        return key;
    }

    /**
     * Simple substitution cipher encryption
     */
    //% block="encrypt %txt with substitution key %key"
    export function sE(txt: string, key: string): string {
        validateSubstitutionKey(key);

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const fullKey = key + key.toLowerCase(); // Create 52-char key
        let out = "";

        for (let i = 0; i < txt.length; i++) {
            const c = txt.charAt(i);
            const idx = alphabet.indexOf(c);

            if (idx >= 0) {
                out += fullKey.charAt(idx);
            } else {
                out += c; // Non-alphabet characters unchanged
            }
        }
        return out;
    }

    /**
     * Simple substitution cipher decryption
     */
    //% block="decrypt %txt with substitution key %key"
    export function sD(txt: string, key: string): string {
        validateSubstitutionKey(key);

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const fullKey = key + key.toLowerCase();
        let out = "";

        for (let i = 0; i < txt.length; i++) {
            const c = txt.charAt(i);
            const idx = fullKey.indexOf(c);

            if (idx >= 0) {
                out += alphabet.charAt(idx);
            } else {
                out += c; // Non-alphabet characters unchanged
            }
        }
        return out;
    }

    /**
     * Reverse cipher encryption/decryption
     */
    //% block="reverse %txt"
    export function rC(txt: string): string {
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