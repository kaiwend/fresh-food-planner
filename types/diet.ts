import { z } from "zod";

enum Focus {
  balanced = "balanced",
  highFiber = "high-fiber",
  highProtein = "high-protein",
  lowCarb = "low-carb",
  lowFat = "low-fat",
  lowSodium = "low-sodium",
}

enum Health {
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

//   American, Asian, British, Caribbean, Central Europe, Chinese, Eastern Europe, French, Indian, Italian, Japanese, Kosher, Mediterranean, Mexican, Middle Eastern, Nordic, South American, South East Asian

enum Cuisine {
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

export const dietSchema = z.object({
  focus: z.optional(z.array(z.nativeEnum(Focus))),
  health: z.optional(z.array(z.nativeEnum(Health))),
  cuisineType: z.optional(z.array(z.nativeEnum(Cuisine))),
  // old
  allergies: z.optional(z.array(z.string())),
  dislikes: z.optional(z.array(z.string())),
  preferences: z
    .optional(z.array(z.string()))
    .describe(
      "Preferred ingredients, cuisine type or meals, should contain at least 5 items",
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
