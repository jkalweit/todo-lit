import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";

const createConfig = (routeName) => {
	return {
		external: ["moment", "page"],
		input: `src/routes/${routeName}/client/app.js`,
		output: {
			sourcemap: true,
			format: "iife",
			name: "app",
			file: `src/routes/${routeName}/public/bundle.js`,
			globals: {
				moment: "moment",
				page: "page",
			},
		},
		plugins: [
			resolve({
				browser: true,
			}),
			commonjs(),
			sourcemaps(),
		],
		watch: {
			clearScreen: true
		},
	};
};

export default [
	createConfig("home"),
	createConfig("todo"),
];