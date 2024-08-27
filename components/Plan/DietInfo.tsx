import { Diet } from "@/types/diet.ts";
import Card from "../Card.tsx";
import InfoBlocks from "../InfoBlocks.tsx";

const formatValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(", ") : value ?? "N/A";

const DietInfo = (props: { diet: Diet }) => (
  <Card title="Diet">
    <InfoBlocks
      items={[
        {
          title: "Preferences",
          value: formatValue(props.diet.preferences),
        },
        {
          title: "Dislikes",
          value: formatValue(props.diet.dislikes),
        },
        { title: "Allergies", value: formatValue(props.diet.allergies) },
      ]}
    />
  </Card>
);

export default DietInfo;
