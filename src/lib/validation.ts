/**
 * Shared Zod validation schemas.
 *
 * Central source of truth for all input validation.
 * Import from here instead of defining ad-hoc schemas in each file.
 */
import { z } from "zod";

// ── Primitives ──

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(255, "Email is too long")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Min 8 characters")
  .max(72, "Max 72 characters");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

export const slugSchema = z
  .string()
  .trim()
  .max(200, "Slug is too long")
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, "Slug must be lowercase alphanumeric with dashes");

export const uuidSchema = z.string().uuid("Invalid ID");

export const urlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .url("Invalid URL");

export const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .refine((v) => v === "" || z.string().url().safeParse(v).success, "Invalid URL")
  .or(z.literal(""));

// ── Domain Schemas ──

/** Contact form — used in /contact page */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(200, "Subject is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(4000, "Message is too long"),
});

/** Review form — used on resource detail page */
export const reviewFormSchema = z.object({
  rating: z.number().int("Rating must be a whole number").min(1, "Min rating is 1").max(5, "Max rating is 5"),
  comment: z.string().trim().max(4000, "Comment is too long").optional().or(z.literal("")),
});

/** Resource form — used in admin panel */
export const resourceFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300, "Title is too long"),
  slug: z
    .string()
    .trim()
    .max(200, "Slug is too long")
    .refine(
      (v) => v === "" || /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(v),
      "Slug must be lowercase alphanumeric with dashes",
    )
    .optional()
    .or(z.literal("")),
  description: z.string().trim().max(1000, "Description is too long").optional().or(z.literal("")),
  long_description: z.string().trim().max(10000, "Long description is too long").optional().or(z.literal("")),
  price_inr: z.number().min(0, "Price cannot be negative").max(999999, "Price is too high"),
  is_free: z.boolean(),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  category_id: z.string().uuid("Invalid category").optional().or(z.literal("")),
  thumbnail_url: optionalUrlSchema.optional().or(z.literal("")),
  external_url: optionalUrlSchema.optional().or(z.literal("")),
  file_path: z.string().max(500, "File path is too long").optional().or(z.literal("")),
});

/** Category form — used in admin panel */
export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
});

/** Blog post form — used in admin panel */
export const blogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300, "Title is too long"),
  slug: z
    .string()
    .trim()
    .max(200, "Slug is too long")
    .refine(
      (v) => v === "" || /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(v),
      "Slug must be lowercase alphanumeric with dashes",
    )
    .optional()
    .or(z.literal("")),
  excerpt: z.string().trim().max(1000, "Excerpt is too long").optional().or(z.literal("")),
  content: z.string().trim().min(1, "Content is required").max(50000, "Content is too long"),
  cover_url: optionalUrlSchema.optional().or(z.literal("")),
  is_published: z.boolean(),
});

/** Newsletter subscription */
export const newsletterSchema = z.object({
  email: emailSchema,
});
