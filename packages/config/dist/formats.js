import { parse as yamlParse } from "yaml";
import { parse as tomlParse } from '@ltd/j-toml';
export const defaultFormats = new Map([
    ["json", JSON.parse],
    ["toml", tomlParse],
    ["yaml", yamlParse],
]);
export function buildFormats(formatOption, applyDefaults) {
    if (formatOption === null)
        return applyDefaults ? defaultFormats : new Map();
    if (formatOption instanceof Map) {
        const formats = new Map(applyDefaults ? defaultFormats : []);
        for (let [ext, format] of formatOption) {
            while (typeof format === "string") {
                const newFormat = formats.get(format) || defaultFormats.get(format) || formatOption.get(format);
                if (!newFormat || newFormat === format) {
                    throw new Error(`Format ${format} not found`);
                }
                format = newFormat;
            }
            formats.set(ext, format);
        }
        return formats;
    }
    else {
        const map = new Map(Object.entries(formatOption));
        return buildFormats(map, applyDefaults);
    }
}
//# sourceMappingURL=formats.js.map