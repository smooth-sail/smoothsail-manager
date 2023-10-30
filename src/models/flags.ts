import { z } from "zod";

export const newFlagSchema = z.object({
  title: z.string().trim().min(1, { message: "Flag name is required" }),
  fKey: z.string().trim().min(1, { message: "Flag key is required" }),
  description: z.string().optional(),
});

export const flagUpdatesSchema = z.object({
  title: z.string().trim().min(1, { message: "Flag name is required" }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
