import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  parentId: z.string().optional().nullable(),
  isReturnable: z.boolean().default(true),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
