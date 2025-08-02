**arcade-base64**

A MakeCode Arcade extension that provides a base64 string encoder/decoder, hiding Base64 under non‑obvious names. It adds two blocks and corresponding TypeScript functions for lightweight obfuscation of text.

---

## Features

* **encrypt** (`u8x3.e1`): Encodes any ASCII string into an obfuscated Base64-like format.
* **decrypt** (`u8x3.d2`): Decodes the obfuscated string back into the original text.

All functions live under the `u8x3` namespace to avoid exposing "base64" in code or blocks.

---

## Installation

1. Open your MakeCode Arcade project:
   [https://arcade.makecode.com](https://arcade.makecode.com)

2. Click the ⚙️ **Settings** gear → **Extensions**

3. Paste the URL of this extension ZIP:

   ```text
   https://github.com/Dumb-Dumb1/pxt-base64/archive/refs/tags/v0.0.8.zip
   ```

4. Press **Add** and wait for it to load.

---

## Blocks

After importing, you'll find two blocks under the **u8x3** toolbox category:

| Block           | Description                    |
| --------------- | ------------------------------ |
| `encrypt [txt]` | Encodes the `txt` string.      |
| `decrypt [dat]` | Decodes the `dat` string back. |

---

## JavaScript / TypeScript API

```ts
// Encode a string:
let secret = u8x3.e1("Hello, Arcade!");
// e.g. secret === "SGVsbG8sIEFyY2FkZSE=" (opaque)

// Decode it back:
let original = u8x3.d2(secret);
// original === "Hello, Arcade!"
```

---

## License

MIT © Dumb-Dumb1
