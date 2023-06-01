/**
 * Implements the `Loader` interface expected by `@valued-app/config` for the filesystem.
 *
 * @example
 * const loader = new FsLoader("/path/to/repo");
 * const config = await Config.load(loader);
 */
export declare class FsLoader {
    /**
     * The root path configuration files are resolved relative to.
     */
    readonly rootPath: string;
    /**
     * Creates a new `FsLoader` instance.
     * @param rootPath The root path configuration files are resolved relative to. Should be a directory.
     */
    constructor(rootPath: string);
    /**
     * This is being called by `@valued-app/config` to read a file or directory.
     */
    read(path: string, _options: any): Promise<{
        type: string;
        path: string;
        entries: string[];
        content?: undefined;
    } | {
        type: string;
        path: string;
        content: string;
        entries?: undefined;
    }>;
}
