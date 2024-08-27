import { MetaRecipe } from "@/types/recipe.ts";

export interface EdamamSearchResult {
  from: number;
  to: number;
  count: number;
  _links: Pages;
  hits: MetaRecipe[];
}

interface Pages {
  next: NextPage;
}

interface NextPage {
  href: string;
  title: string;
}
