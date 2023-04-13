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
export type FormatOption = FormatList | {
    [ext: string]: Format | string;
} | null;
export declare const defaultFormats: FormatList;
export declare function buildFormats(formatOption: FormatOption, applyDefaults: boolean): FormatList;
