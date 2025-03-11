import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

export default [
    // ESM
    {
        input: "src/index.ts",
        output: { file: "dist/index.esm.js", format: "esm" },
        plugins: [resolve(), commonjs(), typescript()],
    },
    // CJS
    {
        input: "src/index.ts",
        output: { file: "dist/index.cjs.js", format: "cjs" },
        plugins: [resolve(), commonjs(), typescript()],
    },
    // UMD
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.umd.js",
            format: "umd",
            name: "RenshuuSDK", // global var name for <script> usage
        },
        plugins: [resolve(), commonjs(), typescript()],
    },
];
