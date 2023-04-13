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
    if (typeof value === "object") {
        return normalizePayload(value);
    }
    else {
        return value;
    }
}
//# sourceMappingURL=payload.js.map