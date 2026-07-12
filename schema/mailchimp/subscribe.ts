import { z } from "zod";

const baseSubscriber = {
  email: z.email({ error: "Ongeldig e-mailadres" }),
  name: z.string().min(1, { error: "Geef je naam op" })
};

export const baseSubscriberSchema = z.object(baseSubscriber);

export const mailchimpSubscriberSchema = z.object({
  ...baseSubscriber,
  lastName: z.string().optional(),
  organisation: z.string().optional()
});

export type MailchimpBaseSubscriberSchema = z.infer<typeof baseSubscriberSchema>;
export type MailchimpSubscriberSchema = z.infer<typeof mailchimpSubscriberSchema>;
