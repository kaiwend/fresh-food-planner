import { Schedule, ScheduleEntry } from "@/types/schedule.ts";
import Card from "@/components/Card.tsx";

interface Props {
  schedule: Schedule;
}

const EatingSchedule = (props: Props) => (
  <div>
    <div>
      {props.schedule.map((value) => (
        <>
          <div>{JSON.stringify(value)}</div>
        </>
      ))}
      {props.schedule.map((entry: ScheduleEntry) => (
        <Card title={entry.recipe.recipe.label}>{Object.keys(entry)}</Card>
      ))}
    </div>
  </div>
);

export default EatingSchedule;
