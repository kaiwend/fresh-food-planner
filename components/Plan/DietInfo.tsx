import { Diet } from "@/types/diet.ts";
import Card from "@/components/Card.tsx";
import InfoBlocks from "@/components/InfoBlocks.tsx";

const formatValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(", ") : value ?? "N/A";

const DietInfo = (props: { diet: Diet }) => (
  <Card>
    <div className="card-body">
      <div className="card-title">Diet</div>
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
          { title: "Focus", value: formatValue(props.diet.focus) },
          { title: "Health", value: formatValue(props.diet.health) },
          { title: "Cuisine", value: formatValue(props.diet.cuisineType) },
        ]}
      />
    </div>
  </Card>
);

export default DietInfo;
