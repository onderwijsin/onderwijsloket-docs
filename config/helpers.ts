/// <reference types="node" />

import type { Environment } from "./types/primitives";

import { ENV } from "varlock/env";

/**
 * Normalizes build-time mode input into a supported runtime environment.
 * @param value - Raw build-time mode value.
 * @returns The corresponding normalized runtime environment.
 */
export function resolveEnvironment(value: string | undefined) {
  let environment: Environment;
  switch (value) {
    case "production":
      environment = "production";
      break;
    case "preview":
      environment = "preview";
      break;
    default:
      environment = "development";
  }

  const isDebug = ENV.DEBUG === true;
  const isProd = environment === "production";
  const isPreview = environment === "preview";
  const isDev = environment === "development";
  const isTest =
    ENV.VITEST === true || ENV.NODE_ENV === "test" || ENV.NUXT_TEST === true;

  return {
    environment,
    isDebug,
    isProd,
    isPreview,
    isDev,
    isTest,
  };
}

/**
 * Resolve environment-based Turnstile token values from Varlock.
 *
 * If in development, the methods return tokens that are always valid
 * @param environment - The current normalized environment.
 * @returns An object containing the Turnstile site key and secret key.
 */
export function resolveTurnstile(environment: Environment) {
  const isDevelopment = environment === "development";

  const turnstileSiteKey =
    ENV.TURNSTILE_SITE_KEY ??
    (isDevelopment ? "1x00000000000000000000BB" : undefined);
  const turnstileSecretKey =
    ENV.TURNSTILE_SECRET_KEY ??
    (isDevelopment ? "1x0000000000000000000000000000000AA" : undefined);
  return { turnstileSiteKey, turnstileSecretKey };
}
