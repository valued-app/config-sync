interface GhEntry {
  type: string;
  size: number;
  name: string;
  path: string;
  sha: string;
};

interface GhFile extends GhEntry {
  type: "file";
  encoding: string;
  content: string;
};

interface GhDirectoryObject extends GhEntry {
  type: "dir";
  entries: GhEntry[];
};

type GhDirectory = GhDirectoryObject | GhEntry[];
type GhResult = GhFile | GhDirectory;

type Fetch = (url: string, options: any) => Promise<{
  json(): Promise<GhResult>,
  text(): Promise<string>,
  ok: boolean,
  status: number,
  statusText: string,
}>;


export interface ConstructorOptions {
  repo: string,
  token: string,
  ref?: string,
  endpoint?: string,
  atob?: (str: string) => string,
}

export interface ReadOptions {
  fetch: Fetch;
}

function decodeBase64(str: string): string {
  if (Buffer) return Buffer.from(str, "base64").toString("utf8");
  return atob(str);
}

/**
 * Implements the `Loader` interface expected by `@valued-app/config` for the GitHub Content API.
 *
 * @example
 * const loader = new GhLoader({ repo: "my/repo", token: "my-token" });
 * const config = await Config.load(loader);
 */
export class GhLoader {
  readonly options: ConstructorOptions;

  /**
   * Creates a new `FsLoader` instance.
   */
  constructor(options: ConstructorOptions) {
    if (!options.repo) throw new Error("Missing required option 'repo'");
    if (!options.token) throw new Error("Missing required option 'token'");
    this.options = options;
  }

  /*
   * Reads a file or directory via GitHub Content API.
   */
  async read(path: string, { fetch }: ReadOptions) {
    const endpoint = this.options.endpoint || "https://api.github.com/";
    const url = new URL(`repos/${this.options.repo}/contents/${path}`, endpoint);
    if (this.options.ref) url.searchParams.set("ref", this.options.ref);
    const result = await this.load(fetch, url) as GhResult;

    if (result instanceof Array) {
      return {
        type: "directory",
        path: path,
        entries: result.map(entry => entry.path),
      };
    }

    if (result.type === "dir") {
      return {
        type: "directory",
        path: result.path,
        entries: result.entries.map(entry => entry.path),
      };
    }

    if (result.type === "file") {
      if (result.encoding === "base64") {
        return {
          type: "file",
          path: result.path,
          content: decodeBase64(result.content),
        };
      }

      if (result.encoding === "none") {
        // file is larger than 1 MB, so we need to fetch the content separately
        const body = await this.load(fetch, url, true) as string;
        return {
          type: "file",
          path: result.path,
          content: body,
        };
      }

      throw new Error(`Unsupported encoding: ${result.encoding}`);
    }

    throw new Error(`Unsupported type: ${(result as GhEntry).type}`);
  }

  private async load(fetch: Fetch, url: URL, raw: boolean = false) {
    const href = url.href.endsWith("/") ? `${url.href}.` : url.href;
    const response = await fetch(href, {
      headers: {
        "Content-Type": raw ? "application/vnd.github.raw" : "application/vnd.github.object+json",
        "Authorization": `Bearer ${this.options.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      }
    });

    if (!response.ok) throw new Error(`Failed to read ${href}: ${response.status} ${response.statusText}`);

    const result = raw ? response.text() : response.json();
    return await result;
  }
}
