# arcade-encryption

A MakeCode Arcade extension offering multiple lightweight encryption methods — including Base64, Caesar, XOR, Substitution, ROT13, Atbash, and more — all hidden under non-obvious function names for simple obfuscation and privacy. Useful for text-based puzzles, encoding in games, or basic cipher education.

All functions are wrapped in the `u8x3` namespace to avoid exposing terms like "Base64" or "cipher" directly in the MakeCode block interface.

---

## Features

* **Base64 Encoding**:  
  `u8x3.e1(txt: string)` — Encodes a string into Base64 format  
  `u8x3.d2(dat: string)` — Decodes Base64-encoded string back to original

* **Caesar Cipher**:  
  `u8x3.caesarEncrypt(txt, shift)` — Caesar shift text  
  `u8x3.caesarDecrypt(txt, shift)` — Reverses Caesar shift

* **XOR Cipher**:  
  `u8x3.xorCipher(txt, key)` — Applies XOR between input and key

* **Substitution Cipher**:  
  `u8x3.generateSubstitutionKey()` — Generates a random A–Z key  
  `u8x3.substitutionEncrypt(txt, key)` — Encrypts text using key  
  `u8x3.substitutionDecrypt(txt, key)` — Decrypts back to original

* **Other Ciphers**:  
  `u8x3.reverseCipher(txt)` — Reverses the string  
  `u8x3.rot13(txt)` — Applies ROT13 shift  
  `u8x3.atbash(txt)` — Applies Atbash mirror cipher

---

## Installation

1. Go to [https://arcade.makecode.com](https://arcade.makecode.com)

2. Open your project, click the ⚙️ **Settings** → **Extensions**

3. Paste in the URL:

   ```text
   https://github.com/Dumb-Dumb1/arcade-crypto
   ```

4. Click **Add**, and the blocks will appear under a new category called **u8x3**

---

## Blocks Overview

| Block                                | Function                   |
|-------------------------------------|----------------------------|
| `encrypt [txt]`                     | `u8x3.e1(txt)`             |
| `decrypt [dat]`                     | `u8x3.d2(dat)`             |
| `encrypt [txt] with Caesar shift`   | `u8x3.caesarEncrypt(...)`  |
| `decrypt [txt] with Caesar shift`   | `u8x3.caesarDecrypt(...)`  |
| `apply XOR cipher to [txt] with key`| `u8x3.xorCipher(...)`      |
| `generate substitution key`         | `u8x3.generateSubstitutionKey()` |
| `encrypt [txt] with substitution key`| `u8x3.sE(...)` |
| `decrypt [txt] with substitution key`| `u8x3.sD(...)` |
| `reverse [txt]`                     | `u8x3.rC(...)`  |
| `apply ROT13 to [txt]`              | `u8x3.rot13(...)`          |
| `apply Atbash cipher to [txt]`      | `u8x3.atbash(...)`         |

---

## JavaScript / TypeScript Usage

```ts
let secret = u8x3.e1("Top Secret!")
let decoded = u8x3.d2(secret)

let caes = u8x3.caesarEncrypt("HELLO", 5)  // MJQQT
let undo = u8x3.caesarDecrypt(caes, 5)

let subKey = u8x3.generateSubstitutionKey()
let coded = u8x3.sE("hello", subKey)
let plain = u8x3.sD(coded, subKey)
```

---

## Notes

- Substitution keys must be exactly 26 unique uppercase letters (`A-Z`), no duplicates.
- This is not secure cryptography — it's for simple encoding and game logic.
- Unicode handling is limited to UTF-16 BMP characters (most normal text is fine).
- Use `reverse`, `ROT13`, and `Atbash` for simple mirrored text transformations.

---

## License

MIT © Dumb-Dumb1
