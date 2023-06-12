const normalizeKeys = new Map([
    ["actionKey", "action_key"],
    ["action-key", "action_key"],
]);
export function normalizePayload(payload) {
    if (Array.isArray(payload)) {
        return payload.map(normalizePayloadValue).flat();
    }
    else if (payload instanceof Map) {
        return new Map([...payload].map(([key, value]) => {
            return [normalizeKey(key), normalizePayloadValue(value)];
        }));
    }
    else {
        return new Map(Object.entries(payload).map(([key, value]) => {
            return [normalizeKey(key), normalizePayloadValue(value)];
        }));
    }
}
function normalizeKey(key) {
    return normalizeKeys.get(key) || key;
}
function normalizePayloadValue(value) {
    switch (typeof value) {
        case "object": return normalizePayload(value);
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
};
function normalizeString(value) {
    let match;
    if (match = value.match(pattern.percent)) {
        // not converting to a number so we avoid JavaScript's janky floating point math
        const fullPercent = match[2].padStart(3, "0");
        return `${match[1] || ""}${fullPercent.slice(0, -2)}.${fullPercent.slice(-2)}${match[3] || ""}`;
    }
    if (match = value.match(pattern.week)) {
        return `${Number(match[1]) * 7}d`;
    }
    return value;
}
//# sourceMappingURL=payload.js.map