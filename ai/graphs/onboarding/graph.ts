import type { StateGraphArgs } from "langchain/langgraph";
import { END, MemorySaver, START, StateGraph } from "langchain/langgraph";
import { z } from "zod";
import { cleanObject } from "@/ai/graphs/utils.ts";
import { Diet, dietSchema } from "@/types/diet.ts";
import {
  GENERATE_ONBOARDING_QUESTION_NODE_NAME,
  generateOnboardingQuestion,
} from "@/ai/graphs/onboarding/nodes/generateOnboardingQuestion.ts";
import {
  ASK_HUMAN_ONBOARDING_NODE,
  askHumanOnboardingNode,
} from "@/ai/graphs/onboarding/nodes/askHuman/askHumanOnboarding.ts";
import {
  EXTRACT_DIET_DATA_NODE_NAME,
  extractDietData,
} from "@/ai/graphs/onboarding/nodes/extractDietData.ts";

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

export interface OnboardingAgentState {
  input: string;
  intent: ZodIntent;
  diet: Diet;
  onboardingComplete: boolean;
  chatHistory: string[];
  lastQuestion: string;
  agentScratchpad: string[];
}

const graphState: StateGraphArgs<OnboardingAgentState>["channels"] = {
  input: null,
  intent: null,
  chatHistory: null,
  lastQuestion: null,
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
    value: (oldScratchpad: string[], newScratchpad: string[]) =>
      Array.from(new Set([...oldScratchpad, ...newScratchpad])),
    default: () => [],
  },
};

const workflow = new StateGraph<
  OnboardingAgentState,
  OnboardingAgentState,
  Partial<OnboardingAgentState>,
  typeof ASK_HUMAN_ONBOARDING_NODE
>({
  channels: graphState,
});

workflow
  .addNode(EXTRACT_DIET_DATA_NODE_NAME, extractDietData)
  .addNode(GENERATE_ONBOARDING_QUESTION_NODE_NAME, generateOnboardingQuestion)
  .addNode(ASK_HUMAN_ONBOARDING_NODE, askHumanOnboardingNode)

  .addEdge(START, EXTRACT_DIET_DATA_NODE_NAME)
  .addEdge(GENERATE_ONBOARDING_QUESTION_NODE_NAME, ASK_HUMAN_ONBOARDING_NODE)
  .addEdge(ASK_HUMAN_ONBOARDING_NODE, EXTRACT_DIET_DATA_NODE_NAME)
  .addConditionalEdges(
    EXTRACT_DIET_DATA_NODE_NAME,
    ({ onboardingComplete }) => {
      if (onboardingComplete) {
        return END;
      }
      return GENERATE_ONBOARDING_QUESTION_NODE_NAME;
    },
  );

const checkpointer = new MemorySaver();
export const onboardingGraph = workflow.compile({
  checkpointer,
  interruptBefore: [ASK_HUMAN_ONBOARDING_NODE],
});
