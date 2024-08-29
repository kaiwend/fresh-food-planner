import { ScheduleEntry, ScheduleType } from "@/types/schedule.ts";
import { MetaRecipe } from "@/types/recipe.ts";
import { NarrowedMetaRecipe } from "@/types/edamam.ts";

export class RecipeSaver {
  private sessionId: string;
  private denoKV!: Deno.Kv;
  private scheduleName = "schedule";
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  private getRecipeKey(date: Date, scheduleType: ScheduleType) {
    return `${date.toLocaleDateString("de")}-${scheduleType}`;
  }

  public async setup() {
    this.denoKV = await Deno.openKv();
  }

  public async saveRecipe(
    date: Date,
    scheduleType: ScheduleType,
    recipe: NarrowedMetaRecipe,
  ): Promise<ScheduleEntry> {
    const keyName = this.getRecipeKey(date, scheduleType);

    await this.denoKV.set([this.sessionId, this.scheduleName, keyName], recipe);

    return {
      keyName,
      date: date.toISOString(),
      type: scheduleType,
      edamamRecipe: recipe,
    };
  }
  public async retrieveRecipe(
    date: Date,
    scheduleType: ScheduleType,
  ): Promise<ScheduleEntry | null> {
    const keyName = this.getRecipeKey(date, scheduleType);

    try {
      const recipe = (
        await this.denoKV.get<MetaRecipe>([
          this.sessionId,
          this.scheduleName,
          keyName,
        ])
      ).value;

      if (recipe === null) {
        console.error("recipe not found");
        throw new Error("recipe not found");
      }

      return {
        keyName,
        type: scheduleType,
        date: date.toISOString(),
        edamamRecipe: recipe,
      };
    } catch (e) {
      console.error("error: ", e);
      return null;
    }
  }
}
