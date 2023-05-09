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
        case "string": return value;
        case "number": return value;
        case "boolean": return value;
        case "bigint": return Number(value);
        default: throw new Error(`Unsupported payload value type: ${typeof value}`);
    }
}
//# sourceMappingURL=payload.js.map