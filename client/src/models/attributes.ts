import { z } from "zod";

export const newAttributeSchema = z.object({
  name: z.string().trim().min(1, { message: "Attribute name is required" }),
  aKey: z
    .string()
    .trim()
    .min(1, { message: "Attribute key is required" })
    .regex(/^[A-Za-z0-9._-]+$/, {
      message:
        "Your key can only contain lowercase letters, numbers, dashes, dots and underscores",
    }),
  type: z.enum(["string", "boolean", "number"]),
});

export const attributeUpdateSchema = z.object({
  name: z.string().trim().min(1, { message: "Attribute name is required" }),
  aKey: z
    .string()
    .trim()
    .min(1, { message: "Attribute key is required" })
    .regex(/^[A-Za-z0-9._-]+$/, {
      message:
        "Your key can only contain lowercase letters, numbers, dashes, dots and underscores",
    }),
});
