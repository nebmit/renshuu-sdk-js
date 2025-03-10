import typescript from "rollup-plugin-typescript2";

export default [
    // ESM build
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.esm.js",
            format: "esm",
        },
        plugins: [typescript()],
    },
    // CJS build
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.cjs.js",
            format: "cjs",
        },
        plugins: [typescript()],
    },
    // UMD build for direct <script> usage
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.umd.js",
            format: "umd",
            name: "RenshuuSDK", // global variable name if loaded in a browser
        },
        plugins: [typescript()],
    },
];
