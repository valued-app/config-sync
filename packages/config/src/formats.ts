import { parse as yamlParse } from "yaml";
import { parse as tomlParse } from '@ltd/j-toml';
import { Payload } from "./payload.js";

/**
 * A function that takes a string and parses it into a configuration payload.
 * An example would be `JSON.parse`.
 */
export type Format = (source: string) => Payload;

/**
 * A map of file extensions to formats.
 * @example
 * ``` ts
 * const formats: FormatList = new Map([
 *  ["json", JSON.parse]
 * ]);
 * ```
 */
export type FormatList = Map<string, Format>;

/**
 * A convenience type that allows you to specify formats in multiple ways.
 * Will be converted to a `FormatList` under the hood.
 * @example
 * ``` ts
 * let formats: FormatOption = null;
 * formats = { json: JSON.parse };
 * formats = new Map([["json", JSON.parse]]);
 * formats = null;
 * ```
 */
export type FormatOption = FormatList | { [ext: string]: Format | string } | null;

export const defaultFormats: FormatList = new Map([
  ["json", JSON.parse as Format],
  ["toml", tomlParse as Format],
  ["yaml", yamlParse as Format],
])

export function buildFormats(formatOption: FormatOption, applyDefaults: boolean): FormatList {
  if (formatOption === null) return applyDefaults ? defaultFormats : new Map();
  if (formatOption instanceof Map) {
    const formats: FormatList = new Map(applyDefaults ? defaultFormats : []);
    for (let [ext, format] of formatOption) {
      while (typeof format === "string") {
        const newFormat = formats.get(format) || defaultFormats.get(format) || formatOption.get(format);
        if (!newFormat || newFormat === format) { throw new Error(`Format ${format} not found`); }
        format = newFormat;
      }
      formats.set(ext, format);
    }
    return formats
  } else {
    const map = new Map(Object.entries(formatOption)) as FormatList;
    return buildFormats(map, applyDefaults);
  }
}
