import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
	input: "lib/spirits.ts",
	plugins: [typescript(), terser()],
	output: {
		format: "umd",
		file: "dist/spirits.js",
		name: "Spirit",
		sourcemap: true,
	},
};
