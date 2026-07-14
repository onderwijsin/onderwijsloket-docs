import { TURNSTILE_ACTIONS } from "@constants";
import { mailchimpSubscriberSchema } from "@schema/mailchimp/subscribe";
import { assertTurnstileToken } from "~~/modules/healthcheck/turnstile/runtime/server/utils/turnstile";
import { useApiResponse } from "~~/server/utils/api";
import { subscribeToMailchimp } from "~~/server/utils/mailchimp/subscribe";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await assertTurnstileToken(event, TURNSTILE_ACTIONS.mailchimp);

  const body = await readBody(event);
  const parsed = mailchimpSubscriberSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: z.treeifyError(parsed.error)
    });
  }

  const response = await subscribeToMailchimp(parsed.data, useRuntimeConfig(event).mailchimp);

  return useApiResponse({
    message: response
  });
});
