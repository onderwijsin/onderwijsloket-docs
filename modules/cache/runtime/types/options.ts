export interface ModuleOptions {
  enabled?: boolean;
  /** Bearer or x-admin-token accepted token for /api/_cache endpoints */
  apiToken?: string;
}

export type ResolvedModuleOptions = Required<Pick<ModuleOptions, "enabled">> &
  ModuleOptions;
