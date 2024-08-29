import { MetaRecipe, Recipe } from "@/types/recipe.ts";

export interface EdamamSearchResult {
  from: number;
  to: number;
  count: number;
  _links: Pages;
  hits: MetaRecipe[];
}

export const relevantRecipeKeys = [
  "label",
  "ingredientLines",
  "url",
  "source",
  "calories",
  "yield",
  "totalTime",
  "totalNutrients",
  "co2EmissionsClass",
  "totalCO2Emissions",
] as const;

type RelevantRecipeKeys = (typeof relevantRecipeKeys)[number];

type NarrowedRecipe = Pick<Recipe, RelevantRecipeKeys>;

export type NarrowedMetaRecipe = { recipe: NarrowedMetaRecipe };

export type EdamamSearchResultV2 = Pick<
  EdamamSearchResult,
  "from" | "to" | "count" | "_links"
> & {
  hits: NarrowedRecipe[];
};

interface Pages {
  next: NextPage;
}

interface NextPage {
  href: string;
  title: string;
}
