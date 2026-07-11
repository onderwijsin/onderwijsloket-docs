export interface CacheEntry<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  expires: number;
  value: T;
  mtime: number;
  integrity: string;
}
