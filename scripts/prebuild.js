import { readFileSync, writeFileSync } from "fs";

const root = JSON.parse(readFileSync("package.json", "utf8"));
const dependencies = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

root.workspaces.forEach((pkg) => {
  const config = JSON.parse(readFileSync(`${pkg}/package.json`, "utf8"));

  if (config.version !== root.version) {
    console.log(`Updating ${pkg}/package.json's version to ${root.version}`);
    config.version = root.version;
  }

  dependencies.forEach((dep) => {
    if (config[dep]) {
      Object.keys(config[dep]).forEach((key) => {
        if (!key.startsWith("@valued-app/")) return;
        if (config[dep][key] === root.version) return;
        console.log(`Updating ${pkg}/package.json's ${dep}["${key}"] to ${root.version}`);
        config[dep][key] = root.version;
      });
    }
  });

  writeFileSync(`${pkg}/package.json`, JSON.stringify(config, null, 2));
});