import { Diet } from "../../graphs/main/mainGraph.ts";
import DietInfo from "./DietInfo.tsx";

const Plan = (props: { diet: Diet }) => (
  <div className="p-10 gap-5 flex flex-col">
    <DietInfo diet={props.diet} />
    <input placeholder="Want to change something?" />
  </div>
);

export default Plan;
