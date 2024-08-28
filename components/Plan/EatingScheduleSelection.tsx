import Card from "@/components/Card.tsx";
import { addDays } from "https://unpkg.com/date-fns@3.6.0/addDays.mjs";
import { format } from "https://unpkg.com/date-fns@3.6.0/format.mjs";
import { relevantDates } from "../../routes/[sessionId]/plan.tsx";

const EatingScheduleSelection = (props: { sessionId: string }) => {
  // Get from current day to 7 days ahead all lunch and dinners
  const scheduleItems = relevantDates();

  return (
    <Card>
      <form
        id="generate-plan"
        onSubmit={() => {
          console.log("Generating plan");
        }}
        className="card-body flex flex-col gap-5"
      >
        <div className="card-title">Schedule</div>
        <div className="flex gap-3 justify-center">
          <div className="flex flex-col gap-3">
            <div className="h-5"></div>
            <div className="h-5">Lunch</div>
            <div className="h-5">Dinner</div>
          </div>
          {scheduleItems.map((item) => (
            <div className="flex flex-col gap-3">
              <div className="h-5">{format(item.date, "E", {})}</div>
              <input
                type="checkbox"
                className="h-5"
                name={new Date(item.date.setHours(12)).toISOString()}
                value="lunch"
                checked={item.lunch}
                disabled={!item.lunch}
              />
              <input
                type="checkbox"
                className="h-5"
                name={new Date(item.date.setHours(18)).toISOString()}
                value="dinner"
                checked={item.dinner}
                disabled={!item.dinner}
              />
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-400"
          type="submit"
          form="generate-plan"
          formaction={`/${props.sessionId}/plan`}
          f-partial={`/${props.sessionId}/plan`}
          formmethod="POST"
          // disabled={props.isLoading.value}
        >
          Generate Meal Plan
        </button>
      </form>
    </Card>
  );
};

export default EatingScheduleSelection;
