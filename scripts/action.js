import { setFailed, debug } from "@actions/core";
import { FsLoader } from "../packages/fs-loader/dist/index.js";

async function run() {
  const loader = new FsLoader(".");
  const files = await loader.read(".");
  debug(JSON.stringify(files, null, 2));
}

run().catch((error) => {
  setFailed(error.message);
});
