import Card from "@/components/Card.tsx";
import InfoBlocks from "@/components/InfoBlocks.tsx";

const formatValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.join(", ") : value ?? "N/A";

const DebugInfo = (props: {
  historySummary: string;
  recipeFinderQuery: string;
}) => (
  <Card>
    <div className="card-body">
      <div className="card-title">Debug Info</div>
      <InfoBlocks
        items={[
          {
            title: "History Summary",
            value: formatValue(props.historySummary),
          },
          {
            title: "Recipe Finder Query",
            value: formatValue(props.recipeFinderQuery),
          },
        ]}
      />
    </div>
  </Card>
);

export default DebugInfo;
