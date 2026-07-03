/**
 * Polyfill for `window.storage`.
 *
 * The original component was written for the Claude.ai "artifacts" sandbox,
 * which injects a `window.storage` key-value API automatically. That API
 * does not exist in a normal browser (Chrome on Android, Termux's local
 * dev server, etc.), so calling it directly throws "window.storage is
 * undefined" and the app can't save chats, theme, or API keys.
 *
 * This polyfill implements the same shape (get/set/delete/list, all async,
 * returning { key, value, shared } | null) using the browser's real
 * localStorage, so the rest of Charlie.jsx needs no changes.
 *
 * "shared" data isn't meaningful outside the multi-user artifact sandbox,
 * so it's just stored under a different key prefix locally.
 */

const prefix = (shared) => (shared ? "charlie:shared:" : "charlie:local:");

function safeParseKey(key) {
  if (typeof key !== "string" || key.length === 0 || key.length > 200) {
    throw new Error("Invalid storage key");
  }
  if (/[\s/\\'"]/.test(key)) {
    throw new Error("Storage keys cannot contain whitespace, slashes, or quotes");
  }
}

const storagePolyfill = {
  async get(key, shared = false) {
    safeParseKey(key);
    const raw = localStorage.getItem(prefix(shared) + key);
    if (raw === null) return null;
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    safeParseKey(key);
    localStorage.setItem(prefix(shared) + key, String(value));
    return { key, value: String(value), shared };
  },

  async delete(key, shared = false) {
    safeParseKey(key);
    const existed = localStorage.getItem(prefix(shared) + key) !== null;
    localStorage.removeItem(prefix(shared) + key);
    return { key, deleted: existed, shared };
  },

  async list(keyPrefix = "", shared = false) {
    const base = prefix(shared);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(base)) {
        const shortKey = fullKey.slice(base.length);
        if (shortKey.startsWith(keyPrefix)) keys.push(shortKey);
      }
    }
    return { keys, prefix: keyPrefix, shared };
  }
};

export function installStoragePolyfill() {
  if (typeof window !== "undefined" && !window.storage) {
    window.storage = storagePolyfill;
  }
}
