import { transformObjectForPrompt } from "@/ai/graphs/utils.ts";
import { generateOnboardingQuestionChain } from "@/ai/chains/generateOnboardingQuestion.ts";
import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";

export const GENERATE_ONBOARDING_QUESTION_NODE_NAME =
  "GENERATE_ONBOARDING_QUESTION_NODE_NAME";

export const generateOnboardingQuestion = async (
  state: OnboardingAgentState,
) => {
  const lastQuestion = await generateOnboardingQuestionChain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  console.log(
    "[generateOnboardingQuesiton] lastQuestion: ",
    lastQuestion,
    "\n",
  );

  return { lastQuestion };
};
