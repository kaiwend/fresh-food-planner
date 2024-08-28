import { EdamamRecipe } from "../services/EdamamRecipe.ts";

const input = Deno.args[0];
console.log("input: ", input);

const result = await EdamamRecipe.searchRecipeV2(input);
console.log({ result });
await Deno.writeTextFile("output.json", JSON.stringify(result, null, 2));

console.log("result: ", result.hits.length);
