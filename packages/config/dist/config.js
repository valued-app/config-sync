import { buildFormats } from "./formats.js";
import { defaultOptions } from "./options.js";
import { normalizePayload } from "./payload.js";
/**
 * The `Config` class is the main entry point for loading and converting configuration files.
 */
export class Config {
    /**
     * Loads configuration files from the given loader.
     * @param loader The loader to use.
     * @param callback An optional callback that is called after the configuration has been loaded.
     * @returns A promise that resolves to the loaded configuration.
     *
     * @example
     * const loader = new FsLoader("/path/to/repo");
     * const config = await Config.load(loader);
     *
     * @note
     * This is a convenience method that creates a new `Config` instance and calls `load` on it.
     * If you need to load multiple configurations, pass options or custom formats, you should
     * create a single `Config` instance and call `load` on it multiple times instead.
     */
    static load(loader, callback) {
        const config = new Config();
        const promise = config.load(loader);
        if (callback)
            promise.then(() => callback(config));
        return promise;
    }
    /**
     * Creates a new `Config` instance.
     * @param formats An optional object that maps file extensions to format functions.
     * @param configOptions An optional object that contains configuration options.
     *
     * @example
     * Creating a new `Config` instance with custom formats:
     * ```
     * import JSON5 from "json5";
     * import { Config } from "@valued-app/config";
     *
     * const config = new Config({ "json5": JSON5.parse });
     *
     * config.addFile({
     *   path: "valued.json5",
     *   content: "{ foo: 'bar' }"
     * });
     * ```
     *
     * Passing configuration options:
     * ```
     * import { Config } from "@valued-app/config";
     *
     * const config = new Config(null, {
     *  directories: [".settings"],
     * })
     * ```
     *
     * @see {@link Options}
     * @see {@link FormatOption}
     */
    constructor(formats = null, configOptions = {}) {
        const options = { ...defaultOptions, ...configOptions };
        this.directories = [];
        this.files = new Map();
        this.data = {};
        this.fetch = options.fetch;
        const formatList = buildFormats(formats, options.defaultFormatters);
        let nestedConfigs;
        if (options.nestedConfigs === true)
            nestedConfigs = defaultOptions.nestedConfigs;
        else if (options.nestedConfigs === false)
            nestedConfigs = [];
        else
            nestedConfigs = options.nestedConfigs;
        options.directories.forEach(directory => {
            let prefix;
            if (directory === ".") {
                prefix = "";
            }
            else {
                prefix = `${directory}/`;
                this.directories.push(directory);
            }
            options.configNames.forEach(configName => {
                this.directories.push(`${prefix}${configName}`);
                formatList.forEach((format, extension) => {
                    this.files.set(`${prefix}${configName}.${extension}`, { format, key: configName });
                    nestedConfigs.forEach(key => {
                        this.files.set(`${prefix}${configName}/${key}.${extension}`, { format, key });
                    });
                });
            });
        });
    }
    /**
     * Loads configuration files from the given loader.
     * @param loader The loader to use.
     * @param path The path to load configuration from. Defaults to the root path of the loader.
     * @param expectedType The expected type of the path. Defaults to "directory".
     * @returns A promise that resolves to the loaded configuration.
     *
     * @example
     * Load all files from a loader:
     * ```
     * const loader = new FsLoader("/path/to/repo");
     * const config = new Config();
     * await config.load(loader);
     * ```
     *
     * Load a single file:
     * ```
     * const loader = new FsLoader("/path/to/repo");
     * const config = new Config();
     * await config.load(loader, "valued.json", "file");
     * ```
     *
     * @see {@link Config.load}
     * @see {@link Loader}
     */
    async load(loader, path = ".", expectedType = "directory") {
        const result = await loader.read(path);
        if (result.type !== expectedType) {
            throw new Error(`Cannot load ${path}, unexpected type ${result.type}`);
        }
        if (result.type === "file") {
            this.addFile(result);
        }
        else if (result.type === "directory") {
            const promises = [];
            for (let entry of result.entries) {
                if (this.directories.includes(entry)) {
                    promises.push(this.load(loader, entry, "directory"));
                }
                else if (this.files.has(entry)) {
                    promises.push(this.load(loader, entry, "file"));
                }
            }
            await Promise.all(promises);
        }
        return this;
    }
    /**
     * Adds a file to the configuration.
     * @param file The file to add.
     * @example
     * ```
     * const config = new Config()
     * config.addFile({
     *   path: "valued/goals.toml",
     *   content: `
     *     ["Example goal"]
     *     action-key = "action1"
     *
     *     ["Other goal"]
     *     action-key = "action2"
     *     threshold = 5
     *   `
     * })
     * ```
     *
     * @see {@link LoaderFileResult}
     */
    addFile(file) {
        if (!this.files.has(file.path))
            throw new Error(`Cannot add file ${file.path}, unsupported path`);
        const { format, key } = this.files.get(file.path);
        this.add(key, format(file.content));
    }
    /**
     * Adds a parsed payload to the configuration.
     * @param key The key to add the payload to. "valued", "goals" and "signals" are possible values.
     * @param payload The payload to add.
     * @example
     * ```
     * const config = new Config()
     * config.add("goals", [{
     *   name: "An example goal",
     *   actionKey: "example"
     * }])
     * ```
     */
    add(key, payload) {
        this.addNormalized(key, normalizePayload(payload));
    }
    /**
     * Pushes the configuration to the Valued API.
     * @param token The Valued API token to use.
     * @param endpoint The endpoint to push to. Defaults to the public Valued API.
     */
    async push(token, endpoint = "https://ingest.valued.app/events") {
        const response = await this.fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(this),
        });
        return response.json();
    }
    /**
     * Generates the config event payload as expected by the Valued API.
     * @note This method is called automatically when the config object is passed to `JSON.stringify`.
     * @returns The config event payload.
     */
    toJSON() {
        return {
            category: "config",
            data: this.data
        };
    }
    /**
     * Checks whether a payload is a valid goal definition.
     * Will throw an error if the payload is invalid.
     * @param payload The payload to validate.
     * @throws An error if the payload is invalid.
     */
    validateGoal(payload) {
        if (typeof payload.name !== "string")
            throw new Error("name must be a string");
        if (typeof payload.action_key !== "string")
            throw new Error("action_key must be a string");
        if (payload.threshold !== undefined && typeof payload.threshold !== "number")
            throw new Error("threshold must be a number if set");
    }
    /**
     * Checks whether a payload is a valid signal definition.
     * Will throw an error if the payload is invalid.
     * @param payload The payload to validate.
     * @throws An error if the payload is invalid.
     */
    validateSignal(payload) {
        if (typeof payload.name !== "string")
            throw new Error("name must be a string");
        if (typeof payload.action_key !== "string")
            throw new Error("action_key must be a string");
        if (typeof payload.within !== "string")
            throw new Error("within must be a string");
    }
    validate(key, payload) {
        if (key === "goals")
            this.validateGoal(payload);
        if (key === "signals")
            this.validateSignal(payload);
    }
    addOne(key, payload, name) {
        var _a;
        const object = {};
        if (name)
            object.name = name;
        payload.forEach((value, nestedKey) => object[nestedKey] = value);
        this.validate(key, object);
        (_a = this.data)[key] || (_a[key] = []);
        this.data[key].push(object);
    }
    addNormalized(key, payload) {
        if (key === "valued") {
            payload.forEach((value, nestedKey) => this.addNormalized(nestedKey, value));
            return;
        }
        if (key === "goals" || key === "signals") {
            if (payload instanceof Map) {
                payload.forEach((value, nestedKey) => this.addOne(key, value, nestedKey));
            }
            else {
                payload.forEach((value) => this.addOne(key, value));
            }
            return;
        }
        throw new Error(`Unknown key ${key}`);
    }
}
export const load = Config.load;
//# sourceMappingURL=config.js.map