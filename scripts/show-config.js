import { Config } from "../packages/config/dist/index.js";
import { FsLoader } from "../packages/fs-loader/dist/index.js";

const config = new Config();
const promises = process.argv.slice(2).map((key) => {
  const loader = new FsLoader(key);
  return config.load(loader);
});

Promise.all(promises).then(() => {
  console.log(JSON.stringify(config, null, 2));
});
