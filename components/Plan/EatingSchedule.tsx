import {
  Schedule,
  ScheduleEntry,
  ScheduleEntryWithRecipe,
} from "@/types/schedule.ts";
import Card from "@/components/Card.tsx";

interface Props {
  schedule: Schedule;
}

function hasRecipe(value: ScheduleEntry): value is ScheduleEntryWithRecipe {
  return value.edamamRecipe !== undefined;
}

const EatingSchedule = (props: Props) => {
  const mapCo2EmissionsClass = (co2EmissionsClass: string) => {
    switch (co2EmissionsClass) {
      case "A":
        return "text-green-500";
      case "A+":
        return "text-green-700";
      case "B":
        return "text-yellow-500";
      case "C":
        return "text-yellow-700";
      case "D":
        return "text-red-500";
      case "E":
        return "text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="mx-auto">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3 auto-rows-max grid-flow-row items-start">
        {props.schedule.length === 0 ? (
          <div></div>
        ) : (
          props.schedule
            .filter(hasRecipe)
            .map((entry: ScheduleEntryWithRecipe) => (
              <Card>
                <div className="card-body">
                  <figure>
                    <img
                      src={`/recipe${Math.floor(Math.random() * 13)}.png`}
                      alt={`Image of "${entry.edamamRecipe.recipe.label}"`}
                      className="rounded mb-2"
                    />
                  </figure>
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
                    {entry.edamamRecipe.recipe.totalTime ? " min" : ""}
                  </div>
                  <hr />
                  <div tabindex={0} className="collapse collapse-arrow">
                    <div className="collapse-title pl-0">Nutrients</div>
                    <div className="collapse-content">
                      <div>
                        {Object.entries(
                          entry.edamamRecipe.recipe.totalNutrients,
                        ).map(([_key, value]) => (
                          <div>{`${value.label}: ${Math.floor(value.quantity)}${
                            value.unit
                          }`}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <hr />

                  <div tabindex={0} className="collapse collapse-arrow">
                    <div className="collapse-title pl-0">CO₂ Footprint</div>
                    <div className="collapse-content">
                      <div>
                        {Math.floor(
                          entry.edamamRecipe.recipe.totalCO2Emissions * 100,
                        ) / 100}
                        g (Class:{" "}
                        <span
                          className={mapCo2EmissionsClass(
                            entry.edamamRecipe.recipe.co2EmissionsClass,
                          )}
                        >
                          {entry.edamamRecipe.recipe.co2EmissionsClass}
                        </span>
                        )
                      </div>
                    </div>
                  </div>
                  <script src="//platform.getbring.com/widgets/import.js"></script>

                  <div
                    data-bring-import={entry.edamamRecipe.recipe.url}
                    style="display:none"
                  >
                    <a href="https://www.getbring.com">
                      Bring! Einkaufsliste App f&uuml;r iPhone und Android
                    </a>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};

export default EatingSchedule;
