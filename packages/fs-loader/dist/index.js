import { promises as fs } from "fs";
import { resolve, relative } from "path";
/**
 * Implements the `Loader` interface expected by `@valued-app/config` for the filesystem.
 *
 * @example
 * const loader = new FsLoader("/path/to/repo");
 * const config = await Config.load(loader);
 */
export class FsLoader {
    /**
     * Creates a new `FsLoader` instance.
     * @param rootPath The root path configuration files are resolved relative to. Should be a directory.
     */
    constructor(rootPath) {
        this.rootPath = resolve(rootPath);
    }
    /**
     * This is being called by `@valued-app/config` to read a file or directory.
     */
    async read(path) {
        let fullPath = resolve(this.rootPath, path);
        let lstat = await fs.lstat(path);
        while (lstat.isSymbolicLink()) {
            fullPath = resolve(fullPath, await fs.readlink(fullPath));
            lstat = await fs.lstat(path);
        }
        const relativePath = relative(this.rootPath, fullPath);
        if (lstat.isDirectory()) {
            const entries = await fs.readdir(fullPath);
            return { type: "directory", path: relativePath, entries };
        }
        if (lstat.isFile()) {
            const content = await fs.readFile(fullPath, "utf8");
            return { type: "file", path: relativePath, content };
        }
        throw new Error(`Cannot read file ${fullPath}`);
    }
}
//# sourceMappingURL=index.js.map