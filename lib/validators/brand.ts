import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  logoUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

export type BrandInput = z.infer<typeof brandSchema>;
