import { EdamamSearchResult } from "@/types/edamam.ts";

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

  static async searchRecipeV2(query: string): Promise<EdamamSearchResult> {
    const queryParams = query;

    const url = `${this.baseUrl}?${this.requiredParams()}&q=${queryParams}`;

    const result = await fetch(encodeURI(url));
    return await result.json();
  }

  private static requiredParams() {
    if (!this.edamamAppId || !this.edamamAppKey) {
      throw new Error(
        "Edamam credentials not found. Please set EDAMAM_APP_ID and EDAMAM_APP_KEY environment variables.",
      );
    }
    return this.objectToQueryParams({
      app_id: this.edamamAppId,
      app_key: this.edamamAppKey,
      type: "public",
    });
  }

  private static objectToQueryParams(obj: Record<string, string>) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  }
}
