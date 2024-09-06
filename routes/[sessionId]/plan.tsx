import { Handlers, PageProps } from "$fresh/server.ts";
import Plan from "@/components/Plan/index.tsx";
import { Diet } from "@/types/diet.ts";
import { Schedule, ScheduleType } from "@/types/schedule.ts";
import addDays from "https://unpkg.com/date-fns@3.6.0/addDays.mjs";
import { RecipeFinder } from "@/services/RecipeFinder.ts";
import { ScheduleService } from "@/services/ScheduleService.ts";
import { DietService } from "@/services/DietSaver.ts";
import { HistorySummarySaver } from "@/services/HistorySummarySaver.ts";
import { recipeFinderQueryChain } from "@/ai/chains/recipeFinderQuery.ts";

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

    const dietService = new DietService(sessionId);
    const diet = await dietService.retrieve();
    if (!diet) {
      throw new Error("Diet not found");
    }
    const schedule: Schedule = [];

    const scheduleService = new ScheduleService(sessionId);

    for (const entry of relevantDates()) {
      for (const scheduleType of [ScheduleType.lunch, ScheduleType.dinner]) {
        const key = ScheduleService.constructKey(entry.date, scheduleType);
        const scheduleEntry = await scheduleService.retrieve(key);
        if (scheduleEntry) {
          schedule.push(scheduleEntry);
        }
      }
    }

    return ctx.render({
      diet,
      sessionId,
      schedule,
    });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const existingIngredientsFormData = formData.get("existingIngredients") as
      | string
      | null;
    const existingIngredients = existingIngredientsFormData
      ? existingIngredientsFormData.split(",")
      : [];

    const scheduleItems = formData.getAll("schedule-item") as string[];

    const sessionId = ctx.params.sessionId;

    const dietService = new DietService(sessionId);
    const diet = await dietService.retrieve();

    if (!isDietPresent(diet)) {
      throw new Error("Diet not found");
    }
    if (!dietHasPreferences(diet) || !diet.preferences) {
      throw new Error("No preferences found");
    }

    const historySummarySaver = new HistorySummarySaver(sessionId);
    const historySummary = await historySummarySaver.retrieve();
    console.info({ historySummary });
    if (!historySummary) {
      throw new Error("No history summary found");
    }
    const recipeFinderQuery = await recipeFinderQueryChain.invoke({
      conversationSummary: historySummary,
    });

    console.info({ recipeFinderQuery });

    const recipeFinder = new RecipeFinder(
      recipeFinderQuery,
      existingIngredients,
      scheduleItems.length,
    );
    const recipes = await recipeFinder.findRecipes();

    const scheduleService = new ScheduleService(sessionId);

    let i = 0;
    const schedule: Schedule = [];
    for (const item of scheduleItems) {
      const [date, scheduleType] = item.split("::");
      if (
        scheduleType !== ScheduleType.lunch &&
        scheduleType !== ScheduleType.dinner
      ) {
        throw new Error("Invalid schedule type");
      }

      const key = ScheduleService.constructKey(new Date(date), scheduleType);
      const scheduleEntry = await scheduleService.save(
        {
          keyName: key,
          date,
          type: scheduleType,
          edamamRecipe: recipes[i],
        },
        key,
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
