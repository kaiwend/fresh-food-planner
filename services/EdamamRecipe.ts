import {
  EdamamSearchResult,
  EdamamSearchResultV2,
  relevantRecipeKeys,
} from "@/types/edamam.ts";
import { dishType, mealType } from "@/types/diet.ts";

type QueryParam = {
  name: string;
  value: string | string[];
};

type SearchInput = {
  query: string;
  excludeIngredients: string[];
  mealTypes: mealType[];
  dishTypes: dishType[];
  timeMin: number;
  timeMax?: number;
};

// Put this into a config later
const MAX_RECIPE_TIME = 200;

export class EdamamRecipe {
  private static baseUrl = "https://api.edamam.com/api/recipes/v2";
  private static edamamAppId = Deno.env.get("EDAMAM_APP_ID");
  private static edamamAppKey = Deno.env.get("EDAMAM_APP_KEY");

  static async searchRecipe(query: string): Promise<EdamamSearchResult> {
    const queryParams = query;

    const url = `${this.baseUrl}?${this.requiredParams()}&q=${queryParams}`;

    const result = await fetch(encodeURI(url));
    return await result.json();
  }

  static async searchRecipeV2({
    query,
    mealTypes = [mealType.dinner, mealType.lunch],
    dishTypes = [dishType.mainCourse],
    excludeIngredients = [],
    timeMin = 1,
    timeMax,
  }: SearchInput): Promise<EdamamSearchResultV2> {
    if (timeMax && timeMax < timeMin) {
      throw new Error("timeMax must be greater than timeMin");
    }
    const queryParam = { name: "q", value: query };
    const mealTypesParam = { name: "mealType", value: mealTypes };
    const dishTypesParam = { name: "dishType", value: dishTypes };
    const excludedParam = { name: "excluded", value: excludeIngredients };
    const randomParam = { name: "random", value: "true" };
    const timeParam = {
      name: "time",
      value:
        timeMin && timeMax
          ? `${timeMin}-${timeMax}`
          : `${timeMin}-${MAX_RECIPE_TIME}`,
    };

    const allQueryParams: QueryParam[] = [
      ...this.requiredParams(),
      this.relevantRecipeKeyParams(),
      queryParam,
      excludedParam,
      mealTypesParam,
      dishTypesParam,
      randomParam,
      timeParam,
    ].filter(
      (param) =>
        (Array.isArray(param.value) && param.value.length > 0) ||
        typeof param.value === "string",
    );

    console.log({ allQueryParams });

    const url = `${this.baseUrl}?${allQueryParams
      .map(this.transformToEncodedQueryParam)
      .join("&")}`;

    const result = await (await fetch(encodeURI(url))).json();
    console.log({ result });
    console.log(`Found ${result.hits.length} recipes`);
    return result;
  }

  private static relevantRecipeKeyParams(): QueryParam {
    return {
      name: "field",
      value: relevantRecipeKeys,
    };
  }

  private static requiredParams(): QueryParam[] {
    if (!this.edamamAppId || !this.edamamAppKey) {
      throw new Error(
        "Edamam credentials not found. Please set EDAMAM_APP_ID and EDAMAM_APP_KEY environment variables.",
      );
    }
    return [
      {
        name: "app_id",
        value: this.edamamAppId,
      },
      {
        name: "app_key",
        value: this.edamamAppKey,
      },
      {
        name: "type",
        value: "public",
      },
    ];
  }

  private static transformToEncodedQueryParam(queryParam: QueryParam): string {
    return Array.isArray(queryParam.value)
      ? queryParam.value
          .map(
            (value) =>
              `${queryParam.name}=${
                // dishType causing problems when whitespace is encoded
                value.includes(" ") ? value : encodeURIComponent(value)
              }`,
          )
          .join("&")
      : `${queryParam.name}=${encodeURIComponent(queryParam.value)}`;
  }
}
