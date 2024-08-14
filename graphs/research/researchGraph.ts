import { Diet } from "../main/mainGraph.ts";
import type { StateGraphArgs } from "langchain/langgraph";
import { StateGraph } from "langchain/langgraph";

export interface ResearchAgentState {
  diet: Diet;
}

const graphState: StateGraphArgs<ResearchAgentState>["channels"] = {
  diet: {
    value: (_oldDiet, newDiet) => ({ ...newDiet }),
  },
};

export const researchWorkflow = new StateGraph<
  ResearchAgentState,
  ResearchAgentState,
  typeof graphState
>({ channels: graphState });
