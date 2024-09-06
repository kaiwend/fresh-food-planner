import { z } from "zod";

export const dietSchema = z.object({
  // focus: z.optional(
  //   z.array(z.nativeEnum(Focus)).describe("Focus goals of the user"),
  // ),
  // health: z.optional(
  //   z.array(z.nativeEnum(Health)).describe("Health goals of the user"),
  // ),
  // cuisineType: z.optional(
  //   z.array(z.nativeEnum(Cuisine)).describe("Types of cuisine the user likes"),
  // ),
  allergies: z.optional(
    z
      .array(z.string())
      .describe(
        "Allergies or intollerances against ingredients that should be excluded",
      ),
  ),
  dislikes: z.optional(
    z
      .array(z.string())
      .describe("Personal dispreferences for ingredients of the user"),
  ),
  preferences: z.optional(
    z
      .array(z.string())
      .describe(
        "Prefered ingredients, cuisine type, diet type etc. Basically everything the user likes",
      ),
  ),
});

export type Diet = z.infer<typeof dietSchema>;

export enum mealType {
  breakfast = "Breakfast",
  dinner = "Dinner",
  lunch = "Lunch",
  snack = "Snack",
  teatime = "Teatime",
}

export enum dishType {
  biscuitsAndCookies = "Biscuits and cookies",
  bread = "Bread",
  cereals = "Cereals",
  condimentsAndSauces = "Condiments and sauces",
  desserts = "Desserts",
  drinks = "Drinks",
  mainCourse = "Main course",
  pancake = "Pancake",
  preps = "Preps",
  preserve = "Preserve",
  salad = "Salad",
  sandwiches = "Sandwiches",
  sideDish = "Side dish",
  soup = "Soup",
  starter = "Starter",
  sweets = "Sweets",
}

export enum Focus {
  balanced = "balanced",
  highFiber = "high-fiber",
  highProtein = "high-protein",
  lowCarb = "low-carb",
  lowFat = "low-fat",
  lowSodium = "low-sodium",
}

export enum Health {
  alcoholCocktail = "alcohol-cocktail",
  alcoholFree = "alcohol-free",
  celeryFree = "celery-free",
  crustaceanFree = "crustacean-free",
  dairyFree = "dairy-free",
  DASH = "DASH",
  eggFree = "egg-free",
  fishFree = "fish-free",
  fodmapFree = "fodmap-free",
  glutenFree = "gluten-free",
  immunoSupportive = "immuno-supportive",
  ketoFriendly = "keto-friendly",
  kidneyFriendly = "kidney-friendly",
  kosher = "kosher",
  lowFatAbs = "low-fat-abs",
  lowPotassium = "low-potassium",
  lowSugar = "low-sugar",
  lupineFree = "lupine-free",
  Mediterranean = "Mediterranean",
  molluskFree = "mollusk-free",
  mustardFree = "mustard-free",
  noOilAdded = "no-oil-added",
  paleo = "paleo",
  peanutFree = "peanut-free",
  pescatarian = "pescatarian",
  porkFree = "pork-free",
  redMeatFree = "red-meat-free",
  sesameFree = "sesame-free",
  shellfishFree = "shellfish-free",
  soyFree = "soy-free",
  sugarConscious = "sugar-conscious",
  sulfiteFree = "sulfite-free",
  treeNutFree = "tree-nut-free",
  vegan = "vegan",
  vegetarian = "vegetarian",
  wheatFree = "wheat-free",
}

export enum Cuisine {
  american = "American",
  asian = "Asian",
  british = "British",
  caribbean = "Caribbean",
  centralEurope = "Central Europe",
  chinese = "Chinese",
  easternEurope = "Eastern Europe",
  french = "French",
  indian = "Indian",
  italian = "Italian",
  japanese = "Japanese",
  kosher = "Kosher",
  mediterranean = "Mediterranean",
  mexican = "Mexican",
  middleEastern = "Middle Eastern",
  nordic = "Nordic",
  southAmerican = "South American",
  southEastAsian = "South East Asian",
}

export enum dietType {
  balanced = "balanced",
  highFiber = "high-fiber",
  highProtein = "high-protein",
  lowCarb = "low-carb",
  lowFat = "low-fat",
  lowSodium = "low-sodium",
}
