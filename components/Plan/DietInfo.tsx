import { Diet } from "@/types/diet.ts";

const DietInfo = (props: { diet: Diet }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[380px]">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Diet
        </h3>
      </div>
      <InfoBlocks diet={props.diet} />
    </div>
  );
};

export default DietInfo;

const InfoBlocks = (props: { diet: Diet }) => (
  <div className="p-6 pt-0 grid gap-4">
    <SingleInfoBlock title="Preferences" value={props.diet.preferences} />
    <SingleInfoBlock title="Dislikes" value={props.diet.dislikes} />
    <SingleInfoBlock title="Allergies" value={props.diet.allergies} />
    <SingleInfoBlock title="Goal" value={props.diet.goal} />
    <SingleInfoBlock
      title="Eating Schedule"
      value={props.diet.eatingSchedule}
    />
  </div>
);

const SingleInfoBlock = (props: {
  title: string;
  value?: string | string[];
}) => (
  <div className="flex flex-col space-y-1">
    <div className="text-sm text-muted-foreground">{props.title}</div>
    <div className="text-sm font-medium leading-none">
      {Array.isArray(props.value)
        ? props.value.join(", ")
        : props.value ?? "N/A"}
    </div>
  </div>
);
