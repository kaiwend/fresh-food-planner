import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";

export const ASK_HUMAN_ONBOARDING_NODE = "askHumanOnboarding";

// AI generated a question before which is set to the state
// We now get the human response and need to extract information from it
export const askHumanOnboardingNode = (state: OnboardingAgentState) => state;
