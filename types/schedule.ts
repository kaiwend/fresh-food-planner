import { NarrowedMetaRecipe } from "@/types/edamam.ts";

export enum ScheduleType {
  dinner = "dinner",
  lunch = "lunch",
}

export type ScheduleEntry = {
  keyName: string;
  date: string;
  type: ScheduleType;
  edamamRecipe: NarrowedMetaRecipe;
};

export type Schedule = ScheduleEntry[];
