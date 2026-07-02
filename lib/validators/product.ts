import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Label is required"),
  unit: z.string().min(1, "Unit is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  lowStockAt: z.coerce.number().int().min(0).default(10),
  sku: z.string().min(1, "SKU is required"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only"),
  description: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  isReturnable: z.boolean().optional().nullable(),
  isActive: z.boolean().default(true),
  images: z.array(z.string().url("Must be a valid URL")).default([]),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type VariantInput = z.infer<typeof variantSchema>;
export type ProductInput = z.infer<typeof productSchema>;
