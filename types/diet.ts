import { z } from "zod";

export const dietSchema = z.object({
  allergies: z.optional(z.array(z.string())),
  dislikes: z.optional(z.array(z.string())),
  preferences: z
    .optional(z.array(z.string()))
    .describe(
      "Preferred ingredients, cuisine type or meals, should contain at least 5 items",
    ),
});

export type Diet = z.infer<typeof dietSchema>;
