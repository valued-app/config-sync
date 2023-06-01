import action from "@actions/core";
import fetch from "node-fetch";
import { GhLoader } from "../packages/gh-loader/dist/index.js";
import { Config } from "../packages/config/dist/index.js";

const loader = new GhLoader({
  repo: process.env.GITHUB_REPOSITORY,
  ref: process.env.GITHUB_SHA,
  endpoint: process.env.GITHUB_API_URL,
  token: action.getInput("github-token"),
});

const config = new Config(null, { fetch });
const token = action.getInput("token");

function info(message) {
  action.info(`\u001b[34;1m${message}\u001b[0m`);
}

async function run() {
  info("Loading configuration files");
  await config.load(loader);
  if (config.loadedFiles.size === 0) throw new Error("No configuration files found");
  if (config.isEmpty()) action.warning("Configuration is empty");

  info("Publishing configuration");
  action.debug(JSON.stringify(config, null, 2));
  if (!token || token.length === 0) throw new Error("No token provided");
  await config.push(token);
}

run().catch((error) => {
  action.setFailed(error.message);
});
