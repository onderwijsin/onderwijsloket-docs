import { SCALAR_BASE_PATH } from "./constants";

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

/** Resolve the browser URL that Scalar should use to load the configured spec. */
export function getOpenApiScalarUrl(source: OpenApiSource = openApiSource): string {
  return source.type === "remote" ? source.url : `/${source.publicPath.replace(/^\/+/, "")}`;
}

/**
 * Match Scalar's default URL segment formatting for tags and model names.
 *
 * Scalar preserves model casing while lowercasing tags. Keeping the formatter
 * here makes generated Content links independent from parser implementation.
 */
function toScalarSegment(value: string, preserveCase = false): string {
  const normalized = value.slice(0, 255).trim().normalize("NFC");
  const withoutPunctuation = (preserveCase ? normalized : normalized.toLowerCase()).replace(
    /[^\p{L}\p{M}\p{N}\s_-]/gu,
    ""
  );

  return withoutPunctuation.replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Build a path-routed Scalar URL from the current single-document navigation ID. */
function toScalarTarget(referenceId = ""): string {
  return referenceId ? `${SCALAR_BASE_PATH}/${referenceId}` : SCALAR_BASE_PATH;
}

/** Link to Scalar's API introduction. */
export function getScalarInfoTarget(): string {
  return toScalarTarget();
}

/** Link to a Scalar tag navigation entry. */
export function getScalarTagTarget(tag: string): string {
  return toScalarTarget(`tag/${toScalarSegment(tag)}`);
}

/** Link to a Scalar operation navigation entry. */
export function getScalarOperationTarget({
  method,
  path,
  tags
}: {
  method: string;
  path: string;
  tags: string[];
}): string {
  const operationId = `${method.toUpperCase()}${path}`;
  const tag = tags[0];

  return toScalarTarget(tag ? `tag/${toScalarSegment(tag)}/${operationId}` : operationId);
}

/** Link to a Scalar model navigation entry. */
export function getScalarSchemaTarget(name: string): string {
  return toScalarTarget(`models/${toScalarSegment(name, true)}`);
}
