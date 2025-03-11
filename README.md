# renshuu-sdk-js

[![tests](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml/badge.svg)](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/build.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nebmit_renshuu-sdk-js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=nebmit_renshuu-sdk-js)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=nebmit_renshuu-sdk-js&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=nebmit_renshuu-sdk-js)
![npm bundle size](https://img.shields.io/bundlephobia/min/renshuu-sdk-js)

A JavaScript SDK for interacting with the Renshuu API.

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
