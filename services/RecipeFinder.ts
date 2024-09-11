import { EdamamSearchResultV2, NarrowedMetaRecipe } from "@/types/edamam.ts";
import { EdamamRecipe } from "@/services/EdamamRecipe.ts";
import { z } from "zod";
import { Cuisine, Health, dietType } from "@/types/diet.ts";

export const recipeQuerySchema = z.object({
  preferredIngredients: z.optional(
    z.array(
      z
        .string()
        .describe(
          "An ingredient in singular format, feel free to transform plurals and slang words etc.",
        ),
    ),
  ),
  excludedIngredients: z.optional(
    z.array(
      z
        .string()
        .describe(
          "Ingredient to exclude in singular format, dislikes, allergies etc should be excluded",
        ),
    ),
  ),
  health: z.optional(
    z.array(
      z
        .nativeEnum(Health)
        .describe(
          "Classification of diet health if mentioned. Has to be one of the options provided",
        ),
    ),
  ),
  cuisineType: z.optional(
    z.array(
      z
        .nativeEnum(Cuisine)
        .describe(
          "Cuisine type the user likes, if mentioned. Has to be one of the options provided",
        ),
    ),
  ),
  diet: z.optional(
    z.array(
      z
        .nativeEnum(dietType)
        .describe(
          "Classification of diet type of the user if mentioned. Has to be one of the options provided",
        ),
    ),
  ),
});

export type RecipeFinderInput = z.infer<typeof recipeQuerySchema>;

export class RecipeFinder {
  private recipes: NarrowedMetaRecipe[];
  private existingIngredients: string[];
  private preferredIngredients: string[];
  private excludedIngredients: string[];
  private diet: dietType[];
  private health: Health[];
  private cuisineType: Cuisine[];
  private commonSearchParameters: (
    | { diet: dietType[] }
    | { health: Health[] }
    | { cuisineType: Cuisine[] }
  )[];
  private numberRecipesRequired: number;

  constructor(
    {
      preferredIngredients,
      excludedIngredients,
      diet,
      health,
      cuisineType,
    }: RecipeFinderInput,
    existingIngredients: string[],
    numberRecipesRequired: number,
  ) {
    this.existingIngredients = existingIngredients;
    this.preferredIngredients = preferredIngredients ?? [];
    this.excludedIngredients = excludedIngredients ?? [];
    this.diet = diet ?? [];
    this.health = health ?? [];
    this.cuisineType = cuisineType ?? [];
    this.commonSearchParameters = [
      { diet: this.diet },
      { health: this.health },
      { cuisineType: this.cuisineType },
    ];
    this.numberRecipesRequired = numberRecipesRequired;
    this.recipes = [];
  }

  // private async searchRecipe(
  //   {
  //     existingIngredients,
  //     preferredIngredients,
  //     excludedIngredients,
  //   }: EdamamSearchInput,
  //   common,
  // ) {
  //   return await EdamamRecipe.searchRecipe();
  // }

  private pushSingleRecipeIfExists(searchResult: EdamamSearchResultV2) {
    if (searchResult.hits.length > 0) {
      this.recipes.push(searchResult.hits[0]);
    }
  }

  private pushMultipleRecipesIfExists(searchResult: EdamamSearchResultV2) {
    if (searchResult.hits.length > 0) {
      this.recipes.push(...searchResult.hits);
    }
  }

  private async findExistingAndPreferredIngredients() {
    this.pushSingleRecipeIfExists(
      await EdamamRecipe.searchRecipe({
        ingredients: [
          ...this.existingIngredients,
          ...this.preferredIngredients,
        ],
        excludeIngredients: this.excludedIngredients,
        ...this.commonSearchParameters,
      }),
    );
  }

  private async findExistingIngredients() {
    this.pushSingleRecipeIfExists(
      await EdamamRecipe.searchRecipe({
        ingredients: this.existingIngredients,
        excludeIngredients: this.excludedIngredients,
        ...this.commonSearchParameters,
      }),
    );
  }

  private async findSingleExistingIngredient() {
    for (const ingredient of this.existingIngredients) {
      const result = await EdamamRecipe.searchRecipe({
        ingredients: [ingredient],
        excludeIngredients: this.excludedIngredients,
        ...this.commonSearchParameters,
      });

      this.pushSingleRecipeIfExists(result);
    }
  }

  private async findPreferredIngredients() {
    this.pushMultipleRecipesIfExists(
      await EdamamRecipe.searchRecipe({
        ingredients: this.preferredIngredients,
        excludeIngredients: this.excludedIngredients,
        ...this.commonSearchParameters,
      }),
    );
  }

  private async findSinglePreferredIngredient() {
    for (const ingredient of this.preferredIngredients) {
      const result = await EdamamRecipe.searchRecipe({
        ingredients: [ingredient],
        excludeIngredients: this.excludedIngredients,
        ...this.commonSearchParameters,
      });

      this.pushMultipleRecipesIfExists(result);
    }
  }

  public async findRecipes() {
    // Check if there are existing ingredients and if yes, we want a recipe that includes those ingredients
    // First try the full set of existing and preferred ingredients
    if (this.existingIngredients.length > 0) {
      console.info(
        "Trying to find recipe with existing and preferred ingredients",
      );
      await this.findExistingAndPreferredIngredients();

      if (this.recipes.length === 0) {
        console.info(
          "Could not find recipe with existing and preferred ingredients. Trying with existing ingredients only.",
        );
        // Narrow search query to existing ingredients only
        await this.findExistingIngredients();
      }
      if (this.recipes.length === 0) {
        console.info(
          "Could not find recipe with existing ingredients. Trying with single existing ingredients.",
        );
        // Search by single ingredient
        this.findSingleExistingIngredient();
      }
      console.info(
        "Recipes found after looking for existing ingredients:",
        this.recipes.length,
      );
    }

    if (this.recipes.length >= this.numberRecipesRequired) {
      console.info("Found enough recipes... Returning");
      return this.recipes;
    }

    console.info("Retrieving recipes with preferred ingredients");
    await this.findPreferredIngredients();

    if (this.recipes.length < this.numberRecipesRequired) {
      console.info(
        "Could not find enough recipes with preferred ingredients. Trying with single preferred ingredients.",
      );
      await this.findSinglePreferredIngredient();
    }

    return this.recipes;
  }
}
