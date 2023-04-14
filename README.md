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

## Full documentation

You can generate API docs using `npm run docs` (output will be in the `html` directory).