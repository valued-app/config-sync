/**
 * Interface expected by {@link Config.load} as a possible return value of {@link Loader.read},
 * as well as the input to {@link Config.addFile}.
 */
export interface LoaderFileResult {
    type: "file";
    path: string;
    content: string;
}
/**
 * Interface expected by {@link Config.load} as a possible return value of {@link Loader.read}.
 */
export interface LoaderDirectoryResult {
    type: "directory";
    path: string;
    entries: string[];
}
/**
 * Union type for all possible return values of {@link Loader.read}.
 */
export type LoaderResult = LoaderFileResult | LoaderDirectoryResult;
/**
 * Interface expected by {@link Config.load}. Implemented by `@valued/fs-loader` and `@valued/gh-loader`.
 */
export interface Loader {
    /**
     * Reads a file or directory via the loader.
     * @param path The path to read (relative to the root directory).
     */
    read(path: string): Promise<LoaderResult>;
}
