# renshuu-sdk-js

[![tests](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml/badge.svg)](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nebmit_renshuu-sdk-js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=nebmit_renshuu-sdk-js)
[![NPM Version](https://img.shields.io/npm/v/renshuu-sdk-js)](https://www.npmjs.com/package/renshuu-sdk-js)
[![npm bundle size (min)](https://img.shields.io/bundlephobia/min/renshuu-sdk-js)](https://bundlephobia.com/package/renshuu-sdk-js)
[![npm bundle size (minzip)](https://img.shields.io/bundlephobia/minzip/renshuu-sdk-js)](https://bundlephobia.com/package/renshuu-sdk-js)

A JavaScript SDK for interacting with the [Renshuu API](https://api.renshuu.org/docs).

## Installation

```bash
npm install renshuu-sdk-js
```

## Usage

### ES Module

```typescript
import { RenshuuClient } from "renshuu-sdk-js";

const client = new RenshuuClient({ apiKey: "YOUR_API_KEY" });

client.words.searchWords("test").then(console.log);
```

### Browser (UMD)

```html
<script src="https://unpkg.com/renshuu-sdk-js/dist/index.umd.js"></script>
<script>
    const client = new RenshuuSDK.RenshuuClient({ apiKey: "YOUR_API_KEY" });

    client.words.searchWords("test").then(console.log);
</script>
```
