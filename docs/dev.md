# Development

You need Node.js and NPM installed locally.

To get started:

1. Run `npm install` to install dependencies.
2. Run `npm run build` to compile the TypeScript source to JavaScript.
3. Run `npm run docs` to generate documentation.
4. Run `node scripts/show-config.js examples` to see things in action.

You can also run `npm run watch` to automatically rebuild the JavaScript on source changes.

## `node_modules`, `dist`, etc

Unfortunately, dependencies and compilation results need to be checked in. This is because GitHub Actions do not support installing dependencies from NPM, and they do not support compiling TypeScript.
