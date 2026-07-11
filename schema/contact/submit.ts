import { z } from 'zod'

export const contactFormSchema = z.object({
	name: z.string().min(1, { error: 'Vul je naam in' }),
	email: z.email({ error: 'Vul een geldige email in' }),
	phone: z
		.string()
		.optional()
		.refine((val) => !val || /^\+?[0-9\s\-()]{7,}$/.test(val), {
			error: 'Vul een geldig telefoonnummer in'
		}),
	message: z.string().min(1, { error: 'Vul een bericht in' })
})

export const contactSubmissionSchema = contactFormSchema.extend({
	fromPage: z.string().min(1),
	currentPage: z.string().min(1)
})

export type ContactFormSchema = z.infer<typeof contactFormSchema>
export type ContactSubmissionSchema = z.infer<typeof contactSubmissionSchema>
