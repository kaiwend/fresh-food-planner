import { AbstractSaver } from "@/services/AbstractSaver.ts";

export class RecipeFinderQuerySaver extends AbstractSaver<string, undefined> {
  prefixKey = "recipeFinderQuerySaver";

  public constructKey() {
    return this.prefixKey;
  }
}
