import { z } from "zod";

export const segmentOperatorSchema = z
  .literal("any")
  .or(z.literal("all"))
  .default("any");

export const newSegmentSchema = z.object({
  title: z.string().trim().min(1, { message: "Segment name is required" }),
  sKey: z.string().trim().min(1, { message: "Segment key is required" }),
  description: z.string().optional(),
  rulesOperator: segmentOperatorSchema,
});

export const updateSegmentSchema = z.object({
  title: z.string().trim().min(1, { message: "Segment name is required" }),
  description: z.string().optional(),
  rulesOperator: segmentOperatorSchema,
});
