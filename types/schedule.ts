import { MetaRecipe } from "@/types/recipe.ts";

export enum ScheduleType {
  dinner = "dinner",
  lunch = "lunch",
}

export type ScheduleEntry = {
  keyName: string;
  date: string;
  type: ScheduleType;
  recipe: MetaRecipe;
};

export type Schedule = ScheduleEntry[];
