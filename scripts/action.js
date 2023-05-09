import { setFailed, debug } from "@actions/core";

async function run() {
  debug("hi");
}

run().catch((error) => {
  setFailed(error.message);
});
