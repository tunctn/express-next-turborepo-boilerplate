export type LocalStorageKey = "user-id";

export class LocalStorage {
  public set(key: LocalStorageKey, value: string | null | undefined) {
    if (value === null) return this.delete(key);
    if (value === undefined) return this.delete(key);
    if (value === "") return this.delete(key);

    localStorage.setItem(key, value);
  }

  public get(key: LocalStorageKey): string | null {
    return localStorage.getItem(key);
  }

  public delete(key: LocalStorageKey): void {
    localStorage.removeItem(key);
  }
}
export const ls = new LocalStorage();
