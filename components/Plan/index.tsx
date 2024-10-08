import EatingScheduleSelection from "@/components/Plan/EatingScheduleSelection.tsx";
import { Schedule } from "@/types/schedule.ts";
import EatingSchedule from "@/components/Plan/EatingSchedule.tsx";
import DebugInfo from "@/components/Plan/DebugInfo.tsx";

interface Props {
  historySummary: string;
  recipeFinderQuery: string;
  sessionId: string;
  schedule: Schedule;
}

const Plan = (props: Props) => (
  <div className="p-10 flex flex-col gap-5">
    <div className="flex flex-wrap gap-5 mx-auto">
      <DebugInfo
        historySummary={props.historySummary}
        recipeFinderQuery={props.recipeFinderQuery}
      />
      <EatingScheduleSelection sessionId={props.sessionId} />
    </div>
    <div className="gap-5 flex">
      <EatingSchedule schedule={props.schedule} />
    </div>
  </div>
);

export default Plan;
