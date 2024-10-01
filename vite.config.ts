import { defineConfig } from "vite";
import path from "path";
const { version } = require("./package.json");

const repoName = "rivers";
export default ({ mode }) => {
	return {
		base: mode === "github" ? `/${repoName}/version-${version}/` : "./",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
};
