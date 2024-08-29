import { Handlers, PageProps } from "$fresh/server.ts";
import Plan from "@/components/Plan/index.tsx";
import { Diet } from "@/types/diet.ts";
import { EdamamRecipe } from "../../services/EdamamRecipe.ts";
import { Schedule, ScheduleType } from "@/types/schedule.ts";
import addDays from "https://unpkg.com/date-fns@3.6.0/addDays.mjs";
import { RecipeSaver } from "../../services/RecipeSaver.ts";

interface Data {
  diet: Diet;
  schedule: Schedule;
  sessionId: string;
}

export const relevantDates = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    // If time is already past lunch or dinner time, don't show it
    if (i === 0) {
      return {
        date: date as Date,
        lunch: date.getHours() < 14,
        dinner: date.getHours() < 21,
      };
    }
    return {
      date: date as Date,
      lunch: true,
      dinner: true,
    };
  });
};

const isDietPresent = (potentialDiet: unknown): potentialDiet is Diet =>
  !!potentialDiet && "preferences" in (potentialDiet as Diet);

const dietHasPreferences = (diet: Diet): boolean =>
  !!diet.preferences && diet.preferences.length > 0;

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    const sessionId = ctx.params.sessionId;
    const kv = await Deno.openKv();
    const diet = await kv.get<Diet>([sessionId, "diet"]);
    const schedule: Schedule = [];

    const RecipeSaverService = new RecipeSaver(sessionId);
    await RecipeSaverService.setup();
    for (const entry of relevantDates()) {
      for (const scheduleType of [ScheduleType.lunch, ScheduleType.dinner]) {
        const scheduleEntry = await RecipeSaverService.retrieveRecipe(
          entry.date,
          scheduleType,
        );
        if (scheduleEntry) {
          schedule.push(scheduleEntry);
        }
      }
    }

    return ctx.render({
      diet: diet.value as Diet,
      sessionId,
      schedule: schedule,
    });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const sessionId = ctx.params.sessionId;
    const kv = await Deno.openKv();
    const diet = (await kv.get([sessionId, "diet"])).value;
    console.log({ diet });

    if (!isDietPresent(diet)) {
      throw new Error("Diet not found");
    }
    if (!dietHasPreferences(diet) || !diet.preferences) {
      throw new Error("No preferences found");
    }

    const preferences = diet.preferences.join(",");
    const result = await EdamamRecipe.searchRecipeV2({ query: preferences });
    const recipes = result.hits;

    const RecipeSaverService = new RecipeSaver(sessionId);
    await RecipeSaverService.setup();

    let i = 0;
    const schedule: Schedule = [];
    for (const [date, scheduleType] of formData.entries()) {
      if (
        scheduleType !== ScheduleType.lunch &&
        scheduleType !== ScheduleType.dinner
      ) {
        throw new Error("Invalid schedule type");
      }
      const scheduleEntry = await RecipeSaverService.saveRecipe(
        new Date(date),
        scheduleType,
        recipes[i],
      );
      schedule.push(scheduleEntry);

      i++;
    }

    console.log(`User requested ${schedule.length} meals`);

    return ctx.render({ diet: diet, sessionId, schedule });
  },
};

const PlanPage = (props: PageProps<Data>) => (
  <Plan
    diet={props.data.diet}
    schedule={props.data.schedule}
    sessionId={props.data.sessionId}
  />
);

export default PlanPage;
