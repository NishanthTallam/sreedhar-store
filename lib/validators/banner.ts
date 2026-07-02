import { z } from "zod";
import { BannerType } from "@prisma/client";

export const bannerSchema = z.object({
  type: z.nativeEnum(BannerType),
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  linkUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  endsAt: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
});

export type BannerInput = z.infer<typeof bannerSchema>;
