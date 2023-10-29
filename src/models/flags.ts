import { z } from "zod";

export const newFlagSchema = z.object({
  title: z.string().trim().min(1, { message: "Flag name is required" }),
  f_key: z.string().trim().min(1, { message: "Flag key is required" }),
  description: z.string().optional(),
});

export const flagUpdatesSchema = z.object({
  title: z.string().trim().min(1, { message: "Flag name is required" }),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});
