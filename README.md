This repository contains a selection of tools for configuring [Valued](https://valued.app/) via configuration files.

The following TypeScript packages are included:

* `@valued-app/config` – A tool for converting the content of configuration files into API payloads, runs in any ES6 environment (browsers, Node.js, Bun, Deno, editor plugins, etc).
* `@valued-app/fs-loader` – Loads configuration files from the local file system, runs on Node.js (and probably Bun).
* `@valued-app/gh-loader` – Loads configuration files from a GitHub repository, using their [content API](https://docs.github.com/en/rest/repos/contents).

# Configuration files

## Single configuration file

You can create a single configuration file called `valued.[ext]` or `.valued.[ext]` either at the top level, or inside a directory called `config` or `.config`.

Replace `.[ext]` with `.json`, `.yaml`, or `.toml`, based on which format you prefer.

### Example

`.config/valued.yml`

``` yaml
goals:
- name: Example goal
  action_key: action1
- name: Other goal
  action_key: action2
  threshold: 5
```

## Multiple files

You can also create a configuration directory called `valued`, `.valued`, `config/valued`, or `.config/valued` and add specific configuration files for goals and signals.

### Example

`.valued/goals.toml`

``` toml
["Example goal"]
action-key = "action1"

["Other goal"]
action-key = "action2"
threshold = 5
```

# JavaScript usage

## TL;DR

### Loading configuration from the file system

``` javascript
import { load } from "@valued-app/config"
import { FsLoader } from "@valued-app/fs-loader"

load(new FsLoader("."), config => console.log(config.toJSON()))
```


### Programmatically generating configuration

``` javascript
import { Config } from "@valued-app/config"

const config = new Config()

// adding some configuration manually
config.add("goals", [{
  name: "An example goal",
  actionKey: "example"
}])

// loading configuration from a "file"
config.addFile({
  path: "valued/goals.toml",
  content: `
    ["Example goal"]
    action-key = "action1"

    ["Other goal"]
    action-key = "action2"
    threshold = 5
  `
})

// output the API payload
const payload = config.toJSON()
console.log(payload)
```

This will output:

``` json
{
  "category": "config",
  "data": {
    "goals": [
      { "name": "An example goal", "action_key": "example" },
      { "name": "Example goal", "action_key": "action1" },
      { "name": "Other goal", "action_key": "action2", "threshold": 5 }
    ]
  }
}
```

### Pushing a configuration to Valued

``` javascript
import { Config } from "@valued-app/config"
import { FsLoader } from "@valued-app/fs-loader"

// settings
const path = "./my_repo"
const token = "secret Valued token"

// code to load config and push it
const loader = new FsLoader(path)
Config.load(loader).then(config => config.push(token))
```

This will use the standardized [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) API under the hood, as is implemented by all modern browsers, Deno, and Node.js 18 or higher. For Node.js versions prior to 18, you need to install a polyfill, such as [node-fetch](https://www.npmjs.com/package/node-fetch).

You can also pass your own, fetch-compatible function via a configuration option:

``` javascript
const config = new Config(null, {
  // signature: (url: string, options: any) => Promise<{ json(): any }>
  fetch: (url, options) => {
    // this implementation won't actually do anything
    return Promise.resolve({
      json: () => Promise.resolve({ status: "ok" })
    })
  }
})

await config.load(loader)
await config.push(token)
```

## Full documentation

You can generate API docs using `npm run docs` (output will be in the `html` directory).

# Development

You need Node.js and NPM installed locally.

To get started:

1. Run `npm install` to install dependencies.
2. Run `npm run build` to compile the TypeScript source to JavaScript.
3. Run `npm run docs` to generate documentation.
4. Run `node scripts/show-config.js examples` to see things in action.

You can also run `npm run watch` to automatically rebuild the JavaScript on source changes.
