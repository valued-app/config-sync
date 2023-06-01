import { Config } from "../packages/config/dist/index.js";
import { GhLoader } from "../packages/gh-loader/dist/index.js";
import 'dotenv/config';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const [repo, ref] = process.argv.slice(2);

async function run() {
  const loader = new GhLoader({ repo, ref, token });
  const config = await Config.load(loader);
  console.log(JSON.stringify(config, null, 2));
}

run().catch((error) => {
  console.error(error);
});
