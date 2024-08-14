import type { StateGraphArgs } from "langchain/langgraph";
import { END, MemorySaver, START, StateGraph } from "langchain/langgraph";
import { z } from "zod";
import { SUPERVISOR_NODE_NAME, supervisorNode } from "./nodes/supervisor.ts";
import { RESEARCHER_NODE_NAME, researcherNode } from "./nodes/researcher.ts";
import { ONBOARDING_NODE_NAME, onboardingNode } from "./nodes/onboarding.ts";
import { PLANNER_NODE_NAME, plannerNode } from "./nodes/planner.ts";
import {
  ASK_HUMAN_ONBOARDING_NODE,
  askHumanOnboardingNode,
} from "./nodes/askHuman/askHumanOnboarding.ts";
import { cleanObject } from "./utils.ts";
import {
  EXTRACT_DIET_DATA_NODE_NAME,
  extractDietData,
} from "./nodes/extractDietData.ts";

export enum Intent {
  CHANGE_DIET = "change diet",
  RESEARCH_MEALS = "research meals",
  GATHER_INFO = "gather info",
  GENERATE_MEAL_PLAN = "generate meal plan",
}

export const zodIntent = z.nativeEnum(Intent);
type ZodIntent = z.infer<typeof zodIntent>;

export const dietSchema = z.object({
  goal: z.optional(z.string()),
  allergies: z.optional(z.array(z.string())),
  dislikes: z.optional(z.array(z.string())),
  preferences: z.optional(z.array(z.string())),
});

export interface AgentState {
  input: string;
  intent: ZodIntent;
  diet: z.infer<typeof dietSchema>;
  chatHistory: string[];
  lastResponse: string;
}

// Overall plan
// Research agent to create outline of a certain diet type
// onboarding kind of agent to help user get started and gather info like allergies and dislike etc.
// executing agent to actually plan meals for dates

// Overall flow: always start with supervisor node
//
// supervisor decides what to do next based on the input
//
// When the input indicates that the user wants to change the diet, the researcher agent is called
//
// When the input indicates that the user wants to change some concrete details of the diet, the onboarding agent is called
// Or when the diet schema is not complete, the onboarding agent is called
//
// When the input indicates that the user wants to generate a meal plan, the planner agent is called
// Can call the researcher agent to get concrete meal recipes

const graphState: StateGraphArgs<AgentState>["channels"] = {
  input: null,
  intent: null,
  chatHistory: null,
  lastResponse: null,
  diet: {
    value: (
      oldDiet: z.infer<typeof dietSchema>,
      newDiet: z.infer<typeof dietSchema>,
    ) => ({
      ...oldDiet,
      ...cleanObject(newDiet),
    }),
  },
};

const routeToAgent = (state: AgentState) => {
  if (state.intent === "change diet" || state.intent === "gather info") {
    return ONBOARDING_NODE_NAME;
  } else if (state.intent === "research meals") {
    return RESEARCHER_NODE_NAME;
  } else if (state.intent === "generate meal plan") {
    return PLANNER_NODE_NAME;
  } else {
    return END;
  }
};

const workflow = new StateGraph<
  AgentState,
  Partial<AgentState>,
  | "__start__"
  | typeof SUPERVISOR_NODE_NAME
  | typeof ONBOARDING_NODE_NAME
  | typeof PLANNER_NODE_NAME
  | typeof RESEARCHER_NODE_NAME
  | typeof ASK_HUMAN_ONBOARDING_NODE
  | "__end__"
>({ channels: graphState });
workflow
  .addNode(SUPERVISOR_NODE_NAME, supervisorNode)
  .addNode(ONBOARDING_NODE_NAME, onboardingNode)
  .addNode(PLANNER_NODE_NAME, plannerNode)
  .addNode(RESEARCHER_NODE_NAME, researcherNode)
  .addNode(ASK_HUMAN_ONBOARDING_NODE, askHumanOnboardingNode)
  .addNode(EXTRACT_DIET_DATA_NODE_NAME, extractDietData)
  .addConditionalEdges(SUPERVISOR_NODE_NAME, routeToAgent)
  .addEdge(START, EXTRACT_DIET_DATA_NODE_NAME)
  .addEdge(EXTRACT_DIET_DATA_NODE_NAME, SUPERVISOR_NODE_NAME)
  .addEdge(RESEARCHER_NODE_NAME, SUPERVISOR_NODE_NAME)
  .addEdge(ONBOARDING_NODE_NAME, ASK_HUMAN_ONBOARDING_NODE)
  .addEdge(ASK_HUMAN_ONBOARDING_NODE, EXTRACT_DIET_DATA_NODE_NAME)
  .addEdge(EXTRACT_DIET_DATA_NODE_NAME, SUPERVISOR_NODE_NAME)
  .addEdge(PLANNER_NODE_NAME, SUPERVISOR_NODE_NAME);

const checkpointer = new MemorySaver();
export const app = workflow.compile({
  checkpointer,
  interruptBefore: [ASK_HUMAN_ONBOARDING_NODE],
});
