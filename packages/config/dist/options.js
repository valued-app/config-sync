let nodeFetch;
const fetch = globalThis.fetch || async function (url, options) {
    if (!nodeFetch)
        nodeFetch = (await import("node-fetch")).default;
    return nodeFetch(url, options);
};
export const defaultOptions = {
    directories: [".", ".config", "config"],
    configNames: [".valued", "valued"],
    nestedConfigs: ["goals", "signals"],
    defaultFormatters: true,
    fetch,
};
//# sourceMappingURL=options.js.map