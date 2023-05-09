import { FormatOption } from "./formats.js";
import { Loader, LoaderFileResult } from "./loader.js";
import { Options } from "./options.js";
import { Payload } from "./payload.js";
/**
 * The `Config` class is the main entry point for loading and converting configuration files.
 */
export declare class Config {
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
    static load(loader: Loader, callback?: (config: Config) => void): Promise<Config>;
    private directories;
    private files;
    private data;
    private fetch;
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
    constructor(formats?: FormatOption, configOptions?: Options);
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
    load(loader: Loader, path?: string, expectedType?: "file" | "directory"): Promise<this>;
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
    addFile(file: LoaderFileResult): void;
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
    add(key: string, payload: Payload): void;
    /**
     * Pushes the configuration to the Valued API.
     * @param token The Valued API token to use.
     * @param endpoint The endpoint to push to. Defaults to the public Valued API.
     */
    push(token: string, endpoint?: string): Promise<any>;
    /**
     * Generates the config event payload as expected by the Valued API.
     * @note This method is called automatically when the config object is passed to `JSON.stringify`.
     * @returns The config event payload.
     */
    toJSON(): {
        category: string;
        data: any;
    };
    /**
     * Checks whether a payload is a valid goal definition.
     * Will throw an error if the payload is invalid.
     * @param payload The payload to validate.
     * @throws An error if the payload is invalid.
     */
    validateGoal(payload: any): void;
    /**
     * Checks whether a payload is a valid signal definition.
     * Will throw an error if the payload is invalid.
     * @param payload The payload to validate.
     * @throws An error if the payload is invalid.
     */
    validateSignal(payload: any): void;
    private validate;
    private addOne;
    private addNormalized;
}
export declare const load: typeof Config.load;
