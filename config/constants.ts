/**
 * Product identity strings shown in metadata and page headers.
 */
export const APP_IDENTITY = {
  /** Main application title shown in browser/page metadata. */
  siteTitle: "Stichting Onderwijs in",
  /** Primary SEO description used in page metadata. */
  siteDescription:
    "Bij Onderwijs in vinden we dat de allerbeste mensen in het onderwijs zouden moeten werken; de plek waar toekomstige generaties worden opgeleid."
} as const;

/**
 * Supported build-time and runtime environments.
 */
export const SUPPORTED_ENVIRONMENTS = ["development", "production", "preview"] as const;

/**
 * Header names used by request security middleware/helpers.
 */
export const SECURITY_HEADERS = {
  /** Turnstile token header sent by clients to protected routes. */
  turnstileToken: "x-turnstile-token",
  /** Admin bypass token header used for server-to-server testing. */
  adminToken: "x-admin-token"
} as const;

/**
 * Action keys for Turnstile verification.
 */
export const TURNSTILE_ACTIONS = {
  /**
   * Action key for Turnstile verification when subscribing to Mailchimp.
   */
  mailchimp: "mailchimp_subscribe",
  /**
   * Action key for Turnstile verification when submitting the contact form.
   */
  contact: "contact_submit"
} as const;
