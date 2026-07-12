import type { ContactSubmissionSchema } from "@schema/contact/submit";
import type { DirectusContactSubmitConfig } from "../../types/contact";

import { joinURL } from "ufo";

/**
 * Persists a contact-form submission in Directus.
 *
 * @param payload Validated contact submission payload including route metadata.
 * @param config Runtime Directus config required to reach the submissions collection.
 */
export async function submitContactToDirectus(
  payload: ContactSubmissionSchema,
  config: DirectusContactSubmitConfig
): Promise<void> {
  const directusBaseUrl = config.directusBaseUrl?.trim();
  const publicToken = config.publicToken?.trim();

  if (!directusBaseUrl || !publicToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Directus runtime configuration is incomplete"
    });
  }

  await $fetch(joinURL(directusBaseUrl, "/items/submissions"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${publicToken}`,
      "Content-Type": "application/json"
    },
    body: {
      form_type: "contact",
      payload
    }
  });
}
