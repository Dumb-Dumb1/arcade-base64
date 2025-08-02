
namespace base64 {
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

        let output = ""
        let i = 0
        while (i < b64.length) {
            const enc1 = base64Chars.indexOf(b64.charAt(i++))
            const enc2 = base64Chars.indexOf(b64.charAt(i++))
            const enc3 = base64Chars.indexOf(b64.charAt(i++))
            const enc4 = base64Chars.indexOf(b64.charAt(i++))

            const chr1 = (enc1 << 2) | (enc2 >> 4)
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            const chr3 = ((enc3 & 3) << 6) | enc4

            output += String.fromCharCode(chr1)
            if (enc3 != 64) output += String.fromCharCode(chr2)
            if (enc4 != 64) output += String.fromCharCode(chr3)
        }
        return output
    }
}
