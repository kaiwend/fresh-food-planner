import { MetaRecipe, Recipe } from "@/types/recipe.ts";
import { DietType, Health, dishType, mealType, Cuisine } from "@/types/diet.ts";

interface EdamamSearchResult {
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

export type NarrowedMetaRecipe = { recipe: NarrowedRecipe };

export type EdamamSearchResultV2 = Pick<
  EdamamSearchResult,
  "from" | "to" | "count" | "_links"
> & {
  hits: NarrowedMetaRecipe[];
};

interface Pages {
  next: NextPage;
}

interface NextPage {
  href: string;
  title: string;
}

export type EdamamSearchInput = {
  ingredients: string[];
  excludeIngredients?: string[];
  mealTypes?: mealType[];
  dishTypes?: dishType[];
  health?: Health[];
  cuisineType?: Cuisine[];
  diet?: DietType[];
  timeMin?: number;
  timeMax?: number;
};
