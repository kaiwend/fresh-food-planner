import type { StateGraphArgs } from "langchain/langgraph";
import { END, MemorySaver, START, StateGraph } from "langchain/langgraph";
import { z } from "zod";
import { SUPERVISOR_NODE_NAME, supervisorNode } from "./nodes/supervisor.ts";
import { ONBOARDING_NODE_NAME, onboardingNode } from "./nodes/onboarding.ts";
import {
  ASK_HUMAN_ONBOARDING_NODE,
  askHumanOnboardingNode,
} from "./nodes/askHuman/askHumanOnboarding.ts";
import {
  EXTRACT_DIET_DATA_NODE_NAME,
  INITIAL_EXTRACTION_NODE_NAME,
  extractDietData,
} from "./nodes/extractDietData.ts";
import { cleanObject } from "../utils.ts";
import { Diet, dietSchema } from "@/types/diet.ts";

export enum Intent {
  CHANGE_DIET = "change diet",
  RESEARCH_MEALS = "research meals",
  GATHER_INFO = "gather info",
  GENERATE_MEAL_PLAN = "generate meal plan",
}

export const zodIntent = z.nativeEnum(Intent);
type ZodIntent = z.infer<typeof zodIntent>;

export const onboardingSchema = z.object({
  onboardingComplete: z
    .boolean()
    .default(false)
    .describe("Flag to indicate if the onboarding is complete"),
  diet: dietSchema,
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

export interface AgentState {
  input: string;
  intent: ZodIntent;
  diet: Diet;
  onboardingComplete: boolean;
  chatHistory: string[];
  lastResponse: string;
  agentScratchpad: string;
}

const graphState: StateGraphArgs<AgentState>["channels"] = {
  input: null,
  intent: null,
  chatHistory: null,
  lastResponse: null,
  onboardingComplete: null,
  diet: {
    value: (
      oldDiet: z.infer<typeof dietSchema>,
      newDiet: z.infer<typeof dietSchema>,
    ) => ({
      ...oldDiet,
      ...cleanObject(newDiet),
    }),
  },
  agentScratchpad: {
    value: (oldScratchpad: string, newScratchpad: string) =>
      `${oldScratchpad} ${newScratchpad}`,
  },
};

const routeToAgent = (state: AgentState) => {
  if (
    state.intent === Intent.GATHER_INFO ||
    state.intent === Intent.CHANGE_DIET
  ) {
    return ONBOARDING_NODE_NAME;
    // } else if (state.intent === Intent.RESEARCH_MEALS) {
    //   return RESEARCHER_NODE_NAME;
    // } else if (state.intent === Intent.GENERATE_MEAL_PLAN) {
    //   return PLANNER_NODE_NAME;
  } else {
    return END;
  }
};

const workflow = new StateGraph<
  AgentState,
  AgentState,
  Partial<AgentState>,
  typeof ASK_HUMAN_ONBOARDING_NODE
>({
  channels: graphState,
});

workflow
  .addNode(INITIAL_EXTRACTION_NODE_NAME, extractDietData)
  .addNode(SUPERVISOR_NODE_NAME, supervisorNode)
  .addNode(ONBOARDING_NODE_NAME, onboardingNode)
  // .addNode(PLANNER_NODE_NAME, plannerNode)
  // .addNode(RESEARCHER_NODE_NAME, researcherNode)
  .addNode(ASK_HUMAN_ONBOARDING_NODE, askHumanOnboardingNode)
  .addNode(EXTRACT_DIET_DATA_NODE_NAME, extractDietData)

  .addEdge(START, INITIAL_EXTRACTION_NODE_NAME)
  .addEdge(INITIAL_EXTRACTION_NODE_NAME, SUPERVISOR_NODE_NAME)
  .addConditionalEdges(SUPERVISOR_NODE_NAME, routeToAgent)

  // Onboarding
  .addEdge(ONBOARDING_NODE_NAME, ASK_HUMAN_ONBOARDING_NODE)
  .addEdge(ASK_HUMAN_ONBOARDING_NODE, EXTRACT_DIET_DATA_NODE_NAME)
  .addConditionalEdges(
    EXTRACT_DIET_DATA_NODE_NAME,
    ({ onboardingComplete }) => {
      if (onboardingComplete) {
        // return RESEARCHER_NODE_NAME;
        return END;
      }
      return ONBOARDING_NODE_NAME;
    },
  );

// Research
// .addEdge(RESEARCHER_NODE_NAME, SUPERVISOR_NODE_NAME)

// Planner
// .addEdge(PLANNER_NODE_NAME, SUPERVISOR_NODE_NAME);

const checkpointer = new MemorySaver();
export const mainGraph = workflow.compile({
  checkpointer,
  interruptBefore: [ASK_HUMAN_ONBOARDING_NODE],
});

// @TODO: Find a way to loop in between onboarding node until enough data is extracted - then pass on. Should we set some flag when we are done?
