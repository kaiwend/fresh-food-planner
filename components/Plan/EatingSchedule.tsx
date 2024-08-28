import { Schedule, ScheduleEntry } from "@/types/schedule.ts";
import Card from "@/components/Card.tsx";

interface Props {
  schedule: Schedule;
}

const EatingSchedule = (props: Props) => (
  <div className="mx-auto">
    <div className="grid gap-5 grid-cols-3 auto-rows-max grid-flow-row items-start">
      {props.schedule.map((entry: ScheduleEntry) => (
        <Card>
          <figure>
            <img
              src={entry.edamamRecipe.recipe.label}
              alt={`Image of "${entry.edamamRecipe.recipe.label}"`}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-2xl font-semibold leading-none tracking-tight text-gray-400">
              {`${new Date(entry.date).toLocaleDateString("en-us", {
                weekday: "short",
              })} ${new Date(entry.date).toLocaleDateString("de")} ${
                entry.type
              }`}
            </h2>
            <h3 className="text-xl font-semibold leading-none tracking-tight">
              {entry.edamamRecipe.recipe.label}
            </h3>
            <div tabindex={0} className="collapse collapse-arrow">
              <div className="collapse-title pl-0">Ingredients</div>
              <div className="collapse-content">
                <div>
                  {entry.edamamRecipe.recipe.ingredientLines.join(", ")}
                </div>
              </div>
            </div>
            <div>
              <a
                href={entry.edamamRecipe.recipe.url}
                className="underline text-lime-500"
                target="_blank"
              >
                {entry.edamamRecipe.recipe.label} from{" "}
                {entry.edamamRecipe.recipe.source}
              </a>
            </div>
            <hr />
            <div>
              calories: {Math.floor(entry.edamamRecipe.recipe.calories)}
            </div>
            <hr />
            <div>servings: {entry.edamamRecipe.recipe.yield}</div>
            <hr />
            <div>
              time: {entry.edamamRecipe.recipe.totalTime || "unknown"}
              {entry.edamamRecipe.recipe.totalTime ? "min" : ""}
            </div>
            <hr />
            <div tabindex={0} className="collapse collapse-arrow">
              <div className="collapse-title pl-0">Nutrients</div>
              <div className="collapse-content">
                <div>
                  {Object.entries(entry.edamamRecipe.recipe.totalNutrients).map(
                    ([_key, value]) => (
                      <div>{`${value.label}: ${Math.floor(value.quantity)}${
                        value.unit
                      }`}</div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default EatingSchedule;
