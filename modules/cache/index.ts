import type {
  ModuleOptions,
  ResolvedModuleOptions,
} from "./runtime/types/options";
import { moduleSetup, usePrepareMode } from "@config/modules";
import {
  addServerScanDir,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  useLogger,
} from "@nuxt/kit";
import { defu } from "defu";
import { ENV } from "varlock/env";

const MODULE_NAME = "@onderwijsin/nuxt-cache";
const MODULE_KEY = "cache";
const LOG_SCOPE = "cache";

const DEFAULTS: Partial<ModuleOptions> = {
  enabled: true,
};

/**
 * Nuxt cache management module.
 *
 * Registers `/api/_cache/*` admin endpoints backed by Nitro `useStorage('cache')`
 * and injects module runtime config.
 *
 * Also add a custom driver that append `path` meta data to the cache entry
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: MODULE_KEY,
    compatibility: {
      nuxt: "^3.0.0 || ^4.0.0",
    },
  },
  defaults: DEFAULTS,
  setup(userOptions, nuxt) {
    const log = useLogger(LOG_SCOPE);
    const { isPrepareMode } = usePrepareMode(nuxt);

    const { start, end, isEnabled, options, checkAndGetApiToken } =
      moduleSetup<ResolvedModuleOptions>(
        MODULE_NAME,
        MODULE_KEY,
        userOptions,
        DEFAULTS,
        log,
      );

    start();

    // Early exit when module is disabled.
    if (!isEnabled()) {
      return;
    }

    // Set options to runtimeConfig for runtime access
    nuxt.options.runtimeConfig.cache = {
      apiToken: ENV.API_TOKEN,
    };

    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");

    // Ensure runtime code is transpiled and avoid raw ESM path issues in Nitro.
    nuxt.options.build.transpile.push(runtimeDir);

    if (isPrepareMode) {
      log.info("Skipping cache storage driver setup during prepare mode.");
    } else if (ENV.VITEST !== true) {
      // Our driver requires access to the experimental Async Context feature to access route info
      // https://v2.nitro.build/guide/utils#async-context-experimental
      nuxt.options.nitro = defu(
        {
          experimental: {
            asyncContext: true,
          },
        },
        nuxt.options.nitro ?? {},
      );
    }

    // Register module runtime server routes and runtime config typings.
    addServerScanDir(`${runtimeDir}/server`);
    addTypeTemplate({
      filename: "types/cache-config.d.ts",
      src: resolver.resolve(runtimeDir, "types/config.d.ts"),
    });
    addTypeTemplate({
      filename: "types/cache-runtime-config-shape.d.ts",
      src: resolver.resolve(
        runtimeDir,
        "types/cache-runtime-config-shape.d.ts",
      ),
    });

    nuxt.options.routeRules = nuxt.options.routeRules ?? {};
    // Cache management endpoints must always bypass Nitro route caching/prerendering.
    nuxt.options.routeRules["/api/_cache/**"] = {
      ...(nuxt.options.routeRules["/api/_cache/**"] || {}),
      cache: false,
      prerender: false,
    };

    end();
  },
});
