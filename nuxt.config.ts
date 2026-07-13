import { fileURLToPath } from "node:url";
import { varlockVitePlugin } from "@varlock/vite-integration";
import { ENV } from "varlock/env";
import { version } from "./package.json";
import { resolveEnvironment, resolveTurnstile } from "./config/helpers";
import { app } from "./config/head";
import identity, { siteDescription, siteTitle } from "./config/identity";
import { ofetch } from "ofetch";
import { SCALAR_BASE_PATH } from "./config/constants";
import { OPENAPI_DOCUMENT_SLUG } from "./config/openapi";
import { getOpenApiScalarUrl } from "./lib/openapi";
import {
  SITE_MCP_BROWSER_REDIRECT,
  SITE_MCP_DESCRIPTION,
  SITE_MCP_NAME,
  SITE_MCP_ROUTE
} from "./config/siteMcp";

// Runtime environments
const { environment, isDebug, isProd, isPreview, isDev, isTest } = resolveEnvironment(ENV.MODE);

// Resolve Turnstile keys
const { turnstileSiteKey, turnstileSecretKey } = resolveTurnstile(environment);

const appUrl = ENV.NUXT_PUBLIC_SITE_URL!;

export default defineNuxtConfig({
  extends: ["docus"],
  modules: ["@scalar/nuxt", "@nuxtjs/turnstile", "@nuxtjs/plausible", "nuxt-schema-org"],

  hooks: {
    /**
     * Docus registers its assistant endpoint with `addServerHandler`, which
     * can take precedence over the application route at the same path.
     * Remove only Docus's duplicate so the local implementation owns it.
     */
    "nitro:config"(nitroConfig) {
      const assistantApiPath = "/api/assistent";

      nitroConfig.handlers = nitroConfig.handlers?.filter(
        (handler) =>
          handler?.route !== assistantApiPath ||
          !String(handler?.handler).includes("/docus/modules/assistant/")
      );
    }
  },

  alias: {
    "@config": fileURLToPath(new URL("./config", import.meta.url)),
    "@schema": fileURLToPath(new URL("./schema", import.meta.url)),
    "@constants": fileURLToPath(new URL("./config/constants", import.meta.url))
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],

  app: {
    keepalive: true,
    head: app.head
  },

  vite: {
    optimizeDeps: {
      include: [
        "@plausible-analytics/tracker",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "zod",
        "@unhead/schema-org/vue",
        "class-variance-authority",
        "clsx",
        "tailwind-merge"
      ]
    },
    plugins: [varlockVitePlugin({ ssrInjectMode: "auto-load" })]
  },

  nitro: {
    experimental: {
      asyncContext: true
    },
    minify: !isDebug,
    prerender: {
      ignore: ["/dev"]
    }
  },

  debug: {
    nitro: isDebug,
    hydration: isDebug || isDev || isPreview,
    watchers: isDebug || isDev,
    router: isDebug,
    templates: isDebug,
    modules: isDebug,
    hooks: {
      server: isDebug,
      client: isDebug
    }
  },

  $development: {
    routeRules: {
      "/**": { cache: false }
    }
  },

  site: {
    name: siteTitle,
    description: siteDescription,
    url: appUrl,
    titleSeparator: "|",
    defaultLocale: "en", // not needed if you have @nuxtjs/i18n installed
    language: "en_US",
    indexable: isProd && ENV.DISABLE_INDEXING !== true,
    trailingSlash: false
  },

  docus: {
    assistant: {
      // API endpoint path
      apiPath: "/api/assistent"
    }
  },

  mcp: {
    version,
    route: SITE_MCP_ROUTE,
    browserRedirect: SITE_MCP_BROWSER_REDIRECT,
    name: SITE_MCP_NAME,
    description: SITE_MCP_DESCRIPTION
  },

  schemaOrg: {
    identity: isTest ? undefined : identity
  },

  robots: {
    groups: [
      {
        userAgent: "*",
        allow: "/",
        contentUsage: {
          bots: "y",
          "train-ai": "n",
          "ai-output": "y",
          search: "y"
        },
        contentSignal: {
          search: "yes",
          "ai-input": "yes",
          "ai-train": "no"
        }
      }
    ]
  },

  icon: {
    serverBundle: {
      collections: ["lucide", "simple-icons", "bxl", "vscode-icons"]
    }
  },

  fonts: {
    families: [
      { name: "Figtree", weights: [400, 700], global: true },
      { name: "JetBrains Mono", weights: [400, 700], global: true }
    ]
  },

  turnstile: {
    siteKey: turnstileSiteKey,
    secretKey: turnstileSecretKey
  },

  plausible: {
    domain: ENV.PLAUSIBLE_DOMAIN || (appUrl ? new URL(appUrl).host : undefined),
    // https://github.com/nuxt-modules/plausible?tab=readme-ov-file#proxy-configuration
    proxy: true,
    proxyBaseEndpoint: "/api/_plausible",
    ignoredHostnames: ["localhost"],
    autoPageviews: true,
    autoOutboundTracking: true
  },

  scalar: {
    theme: "none",
    darkMode: true,
    hideModels: false,
    metaData: {
      title: siteTitle
    },
    customFetch: ofetch as typeof fetch,
    searchHotKey: undefined,
    showSidebar: true,
    pathRouting: {
      basePath: SCALAR_BASE_PATH
    },
    hideSearch: true,
    hideDarkModeToggle: true,
    agent: {
      disabled: true
    },
    mcp: {
      disabled: true
    },
    hideClientButton: true,
    slug: OPENAPI_DOCUMENT_SLUG,
    url: getOpenApiScalarUrl()
  },

  healthcheck: {
    // TODO add mistral health check
    cache: {
      threshold: {
        warn: 50,
        error: 200
      }
    },
    directus: {
      threshold: {
        warn: 200,
        error: 1000
      }
    }
  },

  runtimeConfig: {
    apiToken: ENV.API_TOKEN,
    mailchimp: {
      apiKey: ENV.MAILCHIMP_API_KEY,
      listId: ENV.MAILCHIMP_LIST,
      server: ENV.MAILCHIMP_SERVER
    },
    directus: {
      baseUrl: ENV.DIRECTUS_URL,
      publicToken: ENV.DIRECTUS_PUBLIC_TOKEN
    },
    mistral: {
      apiKey: ENV.MISTRAL_API_KEY
    },
    public: {
      siteUrl: appUrl,
      siteName: siteTitle,
      titleSeparator: "|",
      mode: {
        isDev,
        isProd,
        isPreview,
        isDebug,
        value: environment
      },
      tracking: {
        disabled: ENV.DISABLE_TRACKING === true
      }
    }
  },

  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        paths: {
          /**
           * Even though nuxt internally makes availabe aliasses such as ~ and ~~, we need to redeclare them here.
           * Otherwise our local modules will not be able to use the aliasses when importing from the parent project.
           */
          "~": ["../app"],
          "~/*": ["../app/*"],
          "@": ["../app"],
          "@/*": ["../app/*"],
          "~~": [".."],
          "~~/*": ["../*"],
          "@@": [".."],
          "@@/*": ["../*"],
          "#shared": ["../shared"],
          "#shared/*": ["../shared/*"],
          "#server": ["../server"],
          "#server/*": ["../server/*"],
          "@config": ["../config"],
          "@config/*": ["../config/*"],
          "@schema": ["../schema"],
          "@schema/*": ["../schema/*"],
          "@constants": ["../config/constants.ts"]
        }
      }
    }
  },

  routeRules: {
    [SCALAR_BASE_PATH]: {
      ssr: false
    },
    "/guides": {
      redirect: "/"
    },
    "/guides/**": {
      redirect: "/**"
    },
    "/guides/getting-started": {
      redirect: "/getting-started/introduction"
    }
  }
});
