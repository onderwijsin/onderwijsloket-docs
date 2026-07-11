import { TURNSTILE_ACTIONS } from "@constants";
import { contactSubmissionSchema } from "@schema/contact/submit";
import { assertTurnstileToken } from "~~/modules/turnstile/runtime/server/utils/turnstile";
import { useApiResponse } from "~~/server/utils/api";
import { submitContactToDirectus } from "~~/server/utils/contact/submit";
import { readValidatedBody } from "h3";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await assertTurnstileToken(event, TURNSTILE_ACTIONS.contact);

  const body = await readValidatedBody(event, (body) =>
    contactSubmissionSchema.safeParse(body),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: z.treeifyError(body.error),
    });
  }

  const config = useRuntimeConfig(event);

  await submitContactToDirectus(body.data, {
    directusBaseUrl: config.directus?.baseUrl,
    publicToken: config.public?.directus?.publicToken,
  });

  return useApiResponse({
    success: true,
  });
});
