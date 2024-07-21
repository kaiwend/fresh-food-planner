import { AgentState } from "../base.ts";

export const RESEARCHER_NODE_NAME = "RESEARCHER_NODE";

export const researcherNode = (state: AgentState) => {
  console.log("in researcher node");
  return state;
};
