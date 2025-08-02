namespace YmFzZTY0 {
    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * Encode a string into Base64 format
     */
    //% block="base64 encode %text"
    export function encode(text: string): string {
        let output = ""
        let i = 0
        while (i < text.length) {
            const chr1 = text.charCodeAt(i++)
            const chr2 = i < text.length ? text.charCodeAt(i++) : NaN
            const chr3 = i < text.length ? text.charCodeAt(i++) : NaN

            const enc1 = chr1 >> 2
            const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
            const enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
            const enc4 = chr3 & 63

            if (isNaN(chr2)) {
                output += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + "=="
            } else if (isNaN(chr3)) {
                output += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + "="
            } else {
                output += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + base64Chars.charAt(enc4)
            }
        }
        return output
    }

    /**
     * Decode a Base64-encoded string back to text
     */
    //% block="base64 decode %b64"
    export function decode(b64: string): string {
        // manually strip invalid chars
        let cleaned = ""
        for (let ch of b64) {
            if (base64Chars.indexOf(ch) >= 0 || ch == "=") cleaned += ch
        }
        b64 = cleaned

        let output2 = ""
        let j = 0
        while (j < b64.length) {
            const enc12 = base64Chars.indexOf(b64.charAt(j++))
            const enc22 = base64Chars.indexOf(b64.charAt(j++))
            const enc32 = base64Chars.indexOf(b64.charAt(j++))
            const enc42 = base64Chars.indexOf(b64.charAt(j++))

            const chr12 = (enc12 << 2) | (enc22 >> 4)
            const chr22 = ((enc22 & 15) << 4) | (enc32 >> 2)
            const chr32 = ((enc32 & 3) << 6) | enc42

            output2 += String.fromCharCode(chr12)
            if (enc32 != 64) output2 += String.fromCharCode(chr22)
            if (enc42 != 64) output2 += String.fromCharCode(chr32)
        }
        return output2
    }
}
