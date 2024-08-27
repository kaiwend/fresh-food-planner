export interface MetaRecipe {
  recipe: Recipe;
  _links: Links;
}

interface Links {
  self: Link;
}

interface Link {
  href: string;
  title: string;
}

export interface Recipe {
  uri: string;
  label: string;
  image: string;
  images: Images;
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: Ingredient[];
  calories: number;
  totalCO2Emissions: number;
  co2EmissionsClass: string;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: { [key: string]: Nutrient };
  totalDaily: { [key: string]: Nutrient };
  digest: Digest[];
}

interface Digest {
  label: string;
  tag: string;
  schemaOrgTag: null | string;
  total: number;
  hasRDI: boolean;
  daily: number;
  unit: Unit;
  sub?: Digest[];
}

enum Unit {
  Empty = "%",
  G = "g",
  Kcal = "kcal",
  Mg = "mg",
  Μg = "µg",
}

interface Images {
  THUMBNAIL: Regular;
  SMALL: Regular;
  REGULAR: Regular;
}

interface Regular {
  url: string;
  width: number;
  height: number;
}

interface Ingredient {
  text: string;
  quantity: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory: string;
  foodId: string;
  image: string;
}

interface Nutrient {
  label: string;
  quantity: number;
  unit: Unit;
}
