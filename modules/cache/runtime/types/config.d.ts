import type { CacheMap, ModuleOptions } from "./options";

declare module "@nuxt/schema" {
  interface RuntimeConfig {
    cache: {
      apiToken: string;
    };
  }
}

export {};
