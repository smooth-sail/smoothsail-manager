import { z } from "zod";

export const segmentOperatorSchema = z
  .literal("any")
  .or(z.literal("all"))
  .default("any");

export const newSegmentSchema = z.object({
  title: z.string().trim().min(1, { message: "Flag name is required" }),
  s_key: z.string().trim().min(1, { message: "Flag key is required" }),
  description: z.string().optional(),
  rules_operator: segmentOperatorSchema,
});
