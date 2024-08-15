import { AgentState } from "../mainGraph.ts";

export const RESEARCHER_NODE_NAME = "RESEARCHER_NODE";

export const researcherNode = (state: AgentState) => {
  // Should call some api using the diet information to recipes, amount could also be specified
  console.log("in researcher node");
  return state;
};
