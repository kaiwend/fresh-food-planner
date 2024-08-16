export class EdamamRecipe {
  // private static baseUrl = "https://api.edamam.com/search";
  private static baseUrl = "https://api.edamam.com/api/recipes/v2";
  private static edamamAppId = Deno.env.get("EDAMAM_APP_ID");
  private static edamamAppKey = Deno.env.get("EDAMAM_APP_KEY");

  static async searchRecipe(query: string) {
    if (!this.edamamAppId || !this.edamamAppKey) {
      throw new Error(
        "Edamam credentials not found. Please set EDAMAM_APP_ID and EDAMAM_APP_KEY environment variables.",
      );
    }

    const requiredParams = this.objectToQueryParams({
      app_id: this.edamamAppId,
      app_key: this.edamamAppKey,
      type: "public",
      count: "1",
    });
    const queryParams = query;

    const url = `${this.baseUrl}?${requiredParams}&q=${queryParams}`;

    // "https://api.edamam.com/search?app_id=900da95e&app_key=40698503668e0bb3897581f4766d77f9&q=avocado&health=tree-nut-free&health=vegetarian",
    const result = await fetch(encodeURI(url));
    return await result.json();
  }

  private static objectToQueryParams(obj: Record<string, string>) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
}
