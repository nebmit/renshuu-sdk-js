# renshuu-sdk-js

[![tests](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml/badge.svg)](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nebmit_renshuu-sdk-js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=nebmit_renshuu-sdk-js)
[![NPM Version](https://img.shields.io/npm/v/renshuu-sdk-js)](https://www.npmjs.com/package/renshuu-sdk-js)
[![npm bundle size (min)](https://img.shields.io/bundlephobia/min/renshuu-sdk-js)](https://bundlephobia.com/package/renshuu-sdk-js)
[![npm bundle size (minzip)](https://img.shields.io/bundlephobia/minzip/renshuu-sdk-js)](https://bundlephobia.com/package/renshuu-sdk-js)

A JavaScript/TypeScript SDK for interacting with the [Renshuu API](https://api.renshuu.org/docs).

- Works in **Node**, modern **browsers**, and **browser extensions** (UMD).
- Supports endpoints for vocabulary, grammar, kanji, schedules, sentences, and user lists.
- Includes **pagination** helpers (`.next()/.prev()`) for multi-page results.
- **Note**: For Node.js usage, you need Node 18+ or a [fetch polyfill](https://github.com/node-fetch/node-fetch) if on an older version.

> This project is not affiliated with renshuu.org.

---

## Installation

Install via npm:

```bash
npm install renshuu-sdk-js
```

Or via yarn:

```bash
yarn add renshuu-sdk-js
```

## Usage

### ES Modules

```js
import { RenshuuClient } from "renshuu-sdk-js";

const client = new RenshuuClient({ apiKey: "YOUR_API_KEY" });

client.vocabulary.search("anathema").then((words) => {
    const word = words.data[0];
    console.log(word.hiragana_full + " - " + word.def);
});
```

### CommonJS

```js
const { RenshuuClient } = require("renshuu-sdk-js");

const client = new RenshuuClient({ apiKey: "YOUR_API_KEY" });

client.vocabulary.search("anathema").then((words) => {
    const word = words.data[0];
    console.log(word.hiragana_full + " - " + word.def);
});
```

### Browser

Include the UMD build directly in your HTML:

```html
<script src="https://unpkg.com/renshuu-sdk-js/dist/index.umd.js"></script>
<script>
    const client = new RenshuuSDK.RenshuuClient({ apiKey: "YOUR_API_KEY" });

    client.vocabulary.search("anathema").then((words) => {
        const word = words.data[0];
        console.log(word.hiragana_full + " - " + word.def);
    });
</script>
```

### Example: Paginated Searches

Some methods return a **paginated** object with `.data` and `.pagination`. You can fetch subsequent pages via `pagination.next()` or `pagination.prev()`:

```js
(async () => {
    const firstPage = await client.grammar.search("です");
    console.log(`Page 1 count: ${firstPage.data.length}`);

    if (firstPage.pagination.hasNext) {
        const secondPage = await firstPage.pagination.next();
        console.log(`Page 2 count: ${secondPage?.data.length}`);
    }
})();
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for discussions.

## License

`renshuu-sdk-js` is available under the MIT License. See [LICENSE](./LICENSE) for details.
