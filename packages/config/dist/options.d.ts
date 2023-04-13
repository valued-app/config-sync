/**
 * Options for {@link Config} instance creation.
 */
export interface Options {
    /**
     * The directories to search for configuration files.
     * Defaults to `[".config", "config"]`.
     * @note This does not include the directory for multiple configuration files (ie. `valued`).
     */
    directories?: string[];
    /**
     * The names of the configuration files (single config file) or the directory containing multiple configuration files.
     * Defaults to `[".valued", "valued"]`.
     */
    configNames?: string[];
    /**
     * The names of supported keys for multiple configuration files.
     * Defaults to `["goals", "signals"]`.
     */
    nestedConfigs?: boolean | string[];
    /**
     * Whether to use the default formatters in addition to any formatters passed to the constructor.
     * Defaults to `true`.
     *
     * @example
     * This will disable support for YAML and TOML files:
     * ```
     * const config = new Config({ json: JSON.parse }, { defaultFormatters: false });
     * ```
     */
    defaultFormatters?: boolean;
}
export declare const defaultOptions: Options;
