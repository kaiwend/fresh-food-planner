import { NarrowedMetaRecipe } from "@/types/edamam.ts";

export enum ScheduleType {
  dinner = "dinner",
  lunch = "lunch",
}

interface _ScheduleEntry {
  keyName: string;
  date: string;
  type: ScheduleType;
}

export interface ScheduleEntryWithRecipe extends _ScheduleEntry {
  edamamRecipe: NarrowedMetaRecipe;
}

export interface ScheduleEntryWithoutRecipe extends _ScheduleEntry {
  edamamRecipe: undefined;
}

export type ScheduleEntry =
  | ScheduleEntryWithRecipe
  | ScheduleEntryWithoutRecipe;

export type Schedule = ScheduleEntry[];
