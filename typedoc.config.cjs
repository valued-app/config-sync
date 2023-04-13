const { workspaces } = require("./package.json");

module.exports = {
  entryPointStrategy: "packages",
  entryPoints: workspaces,
  includeVersion: true,
  out: "html",
}