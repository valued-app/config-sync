# Valued configuration sync

Tooling that allows you to sync configuration files stored locally or on GitHub with the Valued API.

## Configuration files

### Single configuration file

You can create a single configuration file called `valued.[ext]` or `.valued.[ext]` either at the top level, or inside a directory called `config` or `.config`.

Replace `.[ext]` with `.json`, `.yaml`, or `.toml`, based on which format you prefer.

#### Example

`.config/valued.yml`

``` yaml
goals:
- name: Example goal
  action_key: action1
- name: Other goal
  action_key: action2
  threshold: 5
```

### Multiple files

You can also create a configuration directory called `valued`, `.valued`, `config/valued`, or `.config/valued` and add specific configuration files for goals and signals.

#### Example

`.valued/goals.toml`

``` toml
["Example goal"]
action-key = "action1"

["Other goal"]
action-key = "action2"
threshold = 5
```

## Setup as GitHub Action

You need to obtain a token for the Valued API. You can find these in the Valued app under your project's "Integrations" page. Add this as an action secret (from your repository on GitHub, go to "Settings" > "Secrets and Variables" > "Actions"). The examples below assume you named the secret `VALUED_TOKEN`.

You can add the following step to your workflow:

``` yaml
- uses: valued-app/config-sync@main
  with:
    token: ${{ secrets.VALUED_TOKEN }}
```

A full workflow only pushing the configuration might look like this:

``` yaml
name: valued-config-sync

on:
  push:
    branches: [main]

jobs:
  config-upload:
    runs-on: ubuntu-latest
    steps:
      - name: Upload Valued configuration
        uses: valued-app/config-sync@main
        with:
          token: ${{ secrets.VALUED_TOKEN }}
```

## Use as JavaScript library

See [docs/library.md](docs/library.md).
