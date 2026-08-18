// Safe localStorage wrapper for resilient execution in sandboxed iframes and restricted environments

const memoryStore: Record<string, string> = {};

export function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn(`[Storage] Could not read ${key} from localStorage:`, err);
  }
  return memoryStore[key] || null;
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (err) {
    console.warn(`[Storage] Could not write ${key} to localStorage:`, err);
  }
  memoryStore[key] = value;
}

export function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn(`[Storage] Could not remove ${key} from localStorage:`, err);
  }
  delete memoryStore[key];
}
