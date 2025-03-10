# renshuu-sdk-js

[![tests](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/code-coverage.yml/badge.svg)](https://github.com/nebmit/renshuu-sdk-js/actions/workflows/code-coverage.yml)
[![codecov](https://codecov.io/gh/nebmit/renshuu-sdk-js/graph/badge.svg)](https://codecov.io/gh/nebmit/renshuu-sdk-js)

A JavaScript SDK for interacting with the Renshuu API.

## Installation

```bash
npm install renshuu-sdk-js
```

## Usage

### ES Module

```typescript
import { RenshuuClient } from 'renshuu-sdk-js';

const client = new RenshuuClient({ apiKey: 'YOUR_API_KEY' });

client.words.searchWords('test').then(console.log);
```

### Browser (UMD)

```html
<script src="https://unpkg.com/renshuu-sdk-js/dist/index.umd.js"></script>
<script>
  const client = new RenshuuSDK.RenshuuClient({ apiKey: 'YOUR_API_KEY' });

  client.words.searchWords('test').then(console.log);
</script>
```
