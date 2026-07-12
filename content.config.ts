import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { createOpenApiContentSource } from "./lib/openapi-content";

/**
 * Since we want to do various customization on the content collections, we are
 * recreating the collection config from docus. We are mostly following their
 * implementation (while dropping some unnecessary parts), and overriding
 * some parts.
 *
 * Whats dropped
 * - locales
 * - docs prefix
 *
 * For original @see https://github.com/nuxt-content/docus/blob/main/layer/content.config.ts
 */

const createDocsSchema = () =>
  z.object({
    links: z
      .array(
        z.object({
          label: z.string(),
          icon: z.string(),
          to: z.string(),
          target: z.string().optional()
        })
      )
      .optional()
  });

export default defineContentConfig({
  collections: {
    // Docus collections
    docs: defineCollection({
      type: "page",
      source: {
        include: "docs/**",
        prefix: "/",
        exclude: ["index.md"]
      },
      schema: createDocsSchema()
    }),

    landing: defineCollection({
      type: "page",
      source: {
        include: "index.md"
      }
    }),

    // Build-time OpenAPI records. The custom source returns virtual Markdown
    // files, allowing Nuxt Content's FTS5 indexer to search them.
    api: defineCollection({
      type: "page",
      source: createOpenApiContentSource(),
      schema: z.object({
        kind: z.enum(["info", "tag", "operation", "schema"]),
        scalarTarget: z.string(),
        method: z.string().optional(),
        path: z.string().optional(),
        operationId: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    })
  }
});
