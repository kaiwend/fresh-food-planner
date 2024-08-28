import { Diet } from "@/types/diet.ts";
import DietInfo from "@/components/Plan/DietInfo.tsx";
import EatingScheduleSelection from "@/components/Plan/EatingScheduleSelection.tsx";
import { Schedule } from "@/types/schedule.ts";
import EatingSchedule from "@/components/Plan/EatingSchedule.tsx";

interface Props {
  diet: Diet;
  sessionId: string;
  schedule: Schedule;
}

const Plan = (props: Props) => (
  <div className="p-10 flex flex-col gap-5">
    <div className="gap-5 flex mx-auto">
      <DietInfo diet={props.diet} />
      <EatingScheduleSelection sessionId={props.sessionId} />
    </div>
    <div className="gap-5 flex">
      <EatingSchedule schedule={props.schedule} />
    </div>
    <input placeholder="Want to change something?" />
  </div>
);

export default Plan;
