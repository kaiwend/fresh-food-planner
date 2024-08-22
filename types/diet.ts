import { z } from "zod";

export const dietSchema = z.object({
  goal: z
    .optional(z.string())
    .describe('Overall goal of the diet, e.g. "lose weight"'),
  allergies: z.optional(z.array(z.string())),
  dislikes: z.optional(z.array(z.string())),
  preferences: z
    .optional(z.array(z.string()))
    .describe(
      "Preferred ingredients, cuisine type or meals, should contain at least 5 items",
    ),
  eatingSchedule: z
    .optional(z.string())
    .describe(
      "How many times the user eats per day, when he eats and if he eats small, medium or large meal",
    ),
});

export type Diet = z.infer<typeof dietSchema>;
