/**
 * Basic types supported as configuration values in a key-value pair.
 */
export type BasicValue = string | number | boolean;

/**
 * Anything supported as a value in a key-value pair.
 */
export type PayloadValue = BasicValue | Payload | PayloadValue[];

/**
 * A configuration payload (ie, result of a parsed file) as a map.
 */
export type MapPayload = Map<string, PayloadValue>;

/**
 * A configuration payload (ie, result of a parsed file) as an arbitrary object.
 */
export interface ObjectPayload { [key: string]: PayloadValue; }

/**
 * Any payload supported as output by a {@link Format}.
 */
export type Payload = ObjectPayload | MapPayload | Payload[];

/**
 * A payload that has been normalized to a {@link MapPayload}.
 * @private
 */
export type StrictPayloadValue = BasicValue | StrictPayload | StrictPayloadValue[];

/**
 * A payload value that has been normalized to a {@link MapPayload}.
 * @private
 */
export type StrictPayload = Map<string, StrictPayloadValue> | StrictPayload[];

const normalizeKeys: Map<string, string> = new Map([
  ["actionKey", "action_key"],
  ["action-key", "action_key"],
]);

export function normalizePayload(payload: Payload): StrictPayload {
  if (Array.isArray(payload)) {
    return payload.map(normalizePayloadValue).flat() as StrictPayload[];
  } else if (payload instanceof Map) {
    return new Map([...payload].map(([key, value]) => {
      return [normalizeKey(key), normalizePayloadValue(value)];
    }));
  } else {
    return new Map(Object.entries(payload).map(([key, value]) => {
      return [normalizeKey(key), normalizePayloadValue(value)];
    }));
  }
}

function normalizeKey(key: string): string {
  return normalizeKeys.get(key) || key;
}

function normalizePayloadValue(value: PayloadValue): StrictPayloadValue {
  switch (typeof value) {
    case "object": return normalizePayload(value as Payload);
    case "string": return normalizeString(value);
    case "number": return value;
    case "boolean": return value;
    case "bigint": return Number(value);
    default: throw new Error(`Unsupported payload value type: ${typeof value}`);
  }
}

const pattern = {
  percent: /^(?:(\-)|\+|)(\d*)(?:\.(\d+))?%$/,
  week: /^(\d+)w$/,
}

function normalizeString(value: string): StrictPayloadValue {
  let match: RegExpMatchArray | null;
  if (match = value.match(pattern.percent)) {
    // not converting to a number so we avoid JavaScript's janky floating point math
    const fullPercent = match[2].padStart(3, "0");
    return `${match[1] || ""}${fullPercent.slice(0, -2)}.${fullPercent.slice(-2)}${match[3] || ""}`;
  }
  if (match = value.match(pattern.week)) {
    return `${Number(match[1])*7}d`;
  }
  return value;
}
