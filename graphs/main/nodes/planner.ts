import { AgentState } from "../mainGraph.ts";

export const PLANNER_NODE_NAME = "PLANNER_NODE";

export const plannerNode = (state: AgentState) => {
  console.log("in planner node");
  return state;
};
