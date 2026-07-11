import type {
  CacheMap,
  CloudflareModuleOptions,
  ModuleOptions,
} from "./options";

export interface CacheRuntimeConfigShape {
  cache: {
    apiToken: string;
    endpoints?: ModuleOptions["endpoints"];
  };
}
