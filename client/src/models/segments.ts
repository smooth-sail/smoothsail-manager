import { z } from "zod";

export const segmentOperatorSchema = z.enum(["any", "all"]).default("any");

export const newSegmentSchema = z.object({
  title: z.string().trim().min(1, { message: "Segment name is required" }),
  sKey: z
    .string()
    .trim()
    .min(1, { message: "Segment key is required" })
    .regex(/^[A-Za-z0-9._-]+$/, {
      message:
        "Your key can only contain lowercase letters, numbers, dashes, dots and underscores",
    }),
  description: z.string().optional(),
  rulesOperator: segmentOperatorSchema,
});

export const updateSegmentSchema = z.object({
  title: z.string().trim().min(1, { message: "Segment name is required" }),
  description: z.string().optional(),
  rulesOperator: segmentOperatorSchema,
});
