/** Stable Scalar document identifier used by generated API-reference links. */
export const OPENAPI_DOCUMENT_SLUG = "onderwijsloket-api";

/**
 * The OpenAPI input shared by Scalar and the build-time Content generator.
 *
 * Local files must live below `public/` so Scalar can request the same file in
 * the browser that the generator reads during the Nuxt build.
 */
export type OpenApiSource =
  | {
      type: "remote";
      url: string;
    }
  | {
      type: "local";
      publicPath: string;
    };

/** Source of truth for the API reference and its generated search records. */
export const openApiSource: OpenApiSource = {
  type: "remote",
  url: "https://registry.scalar.com/@onderwijsin/apis/dynamic-onderwijsloket-api-specification@latest"
};
