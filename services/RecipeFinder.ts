import { EdamamSearchResultV2, NarrowedMetaRecipe } from "@/types/edamam.ts";
import { EdamamRecipe } from "./EdamamRecipe.ts";

type RecipeFinderInput = {
  existingIngredients: string[];
  preferredIngredients: string[];
  excludedIngredients: string[];
  numberRecipesRequired: number;
};

export class RecipeFinder {
  private recipes: NarrowedMetaRecipe[];
  private existingIngredients: string[];
  private preferredIngredients: string[];
  private excludedIngredients: string[];
  private numberRecipesRequired: number;

  constructor({
    existingIngredients,
    preferredIngredients,
    excludedIngredients,
    numberRecipesRequired,
  }: RecipeFinderInput) {
    this.existingIngredients = existingIngredients;
    this.preferredIngredients = preferredIngredients;
    this.excludedIngredients = excludedIngredients;
    this.numberRecipesRequired = numberRecipesRequired;
    this.recipes = [];
  }

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
      }),
    );
  }

  private async findExistingIngredients() {
    this.pushSingleRecipeIfExists(
      await EdamamRecipe.searchRecipe({
        ingredients: this.existingIngredients,
        excludeIngredients: this.excludedIngredients,
      }),
    );
  }

  private async findSingleExistingIngredient() {
    for (const ingredient of this.existingIngredients) {
      const result = await EdamamRecipe.searchRecipe({
        ingredients: [ingredient],
        excludeIngredients: this.excludedIngredients,
      });

      this.pushSingleRecipeIfExists(result);
    }
  }

  private async findPreferredIngredients() {
    this.pushMultipleRecipesIfExists(
      await EdamamRecipe.searchRecipe({
        ingredients: this.preferredIngredients,
        excludeIngredients: this.excludedIngredients,
      }),
    );
  }

  private async findSinglePreferredIngredient() {
    for (const ingredient of this.preferredIngredients) {
      const result = await EdamamRecipe.searchRecipe({
        ingredients: [ingredient],
        excludeIngredients: this.excludedIngredients,
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
