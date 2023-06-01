interface GhEntry {
    type: string;
    size: number;
    name: string;
    path: string;
    sha: string;
}
interface GhFile extends GhEntry {
    type: "file";
    encoding: string;
    content: string;
}
interface GhDirectoryObject extends GhEntry {
    type: "dir";
    entries: GhEntry[];
}
type GhDirectory = GhDirectoryObject | GhEntry[];
type GhResult = GhFile | GhDirectory;
type Fetch = (url: string, options: any) => Promise<{
    json(): Promise<GhResult>;
    text(): Promise<string>;
    ok: boolean;
    status: number;
    statusText: string;
}>;
export interface ConstructorOptions {
    repo: string;
    token: string;
    ref?: string;
    endpoint?: string;
    atob?: (str: string) => string;
}
export interface ReadOptions {
    fetch: Fetch;
}
/**
 * Implements the `Loader` interface expected by `@valued-app/config` for the GitHub Content API.
 *
 * @example
 * const loader = new GhLoader({ repo: "my/repo", token: "my-token" });
 * const config = await Config.load(loader);
 */
export declare class GhLoader {
    readonly options: ConstructorOptions;
    /**
     * Creates a new `FsLoader` instance.
     */
    constructor(options: ConstructorOptions);
    read(path: string, { fetch }: ReadOptions): Promise<{
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
    private load;
}
export {};
