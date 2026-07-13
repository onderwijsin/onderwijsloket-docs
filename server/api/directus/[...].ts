import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  // Normal upstream (Directus)
  const directusBase = config.directus.baseUrl;

  // Build target path in Directus
  const directusTarget = joinURL(directusBase, event.path.replace(/^\/api\/directus\//, ""));
  const proxyHeaders = getProxyRequestHeaders(event);

  return proxyRequest(event, directusTarget, {
    headers: {
      ...proxyHeaders,
      authorization: `Bearer ${config.directus.publicToken}`
    },
    cookieDomainRewrite: new URL(config.public.siteUrl).hostname,
    cookiePathRewrite: "/"
  }) as Promise<Response>;
});
