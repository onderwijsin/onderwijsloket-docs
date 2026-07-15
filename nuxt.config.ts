import { varlockVitePlugin } from "@varlock/vite-integration";
import { APP_IDENTITY } from "./constants";

export default defineNuxtConfig({
  extends: ["@onderwijsin/docus-plus"],

  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],

  vite: {
    plugins: [varlockVitePlugin({ ssrInjectMode: "auto-load" })]
  },

  site: {
    name: APP_IDENTITY.siteTitle,
    description: APP_IDENTITY.siteDescription
  },

  mcp: {
    name: "Onderwijsloket Docs Public MCP",
    description:
      "Read-only public content discovery for Onderwijsloket Documentation, including guides, tutorials, and API reference materials."
  },

  scalar: {
    metaData: {
      title: APP_IDENTITY.siteTitle
    },
    slug: "onderwijsloket-api"
  },

  routeRules: {
    "/guides": {
      redirect: "/"
    },
    "/guides/**": {
      redirect: "/**"
    },
    "/guides/getting-started": {
      redirect: "/getting-started"
    }
  }
});
