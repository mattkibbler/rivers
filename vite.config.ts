import { defineConfig } from "vite";
import path from "path";
const { version } = require("./package.json");

export default ({ mode }) => {
	return {
		base: mode === "github" ? `/version-${version}/` : "./",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
};
