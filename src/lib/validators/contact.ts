import { z } from "zod";

/**
 * Zod validation schema for the contact/inquiry form.
 * Validates: Requirements 10.6
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or fewer" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(1000, { message: "Message must be 1000 characters or fewer" }),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
