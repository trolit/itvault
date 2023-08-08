export const localStorageManager = {
  save: <T>(key: string, data: T) =>
    window.localStorage.setItem(key, JSON.stringify(data)),

  load: <T>(key: string): T | null => {
    const item = window.localStorage.getItem(key);

    if (!item) {
      return null;
    }

    return JSON.parse(item);
  },
};
