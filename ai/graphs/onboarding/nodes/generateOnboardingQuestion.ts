import { transformObjectForPrompt } from "@/ai/graphs/utils.ts";
import { generateOnboardingQuestionChain } from "@/ai/chains/generateOnboardingQuestion.ts";
import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";
import { dietSchema } from "@/types/diet.ts";

export const GENERATE_ONBOARDING_QUESTION_NODE_NAME =
  "GENERATE_ONBOARDING_QUESTION_NODE_NAME";

export const generateOnboardingQuestion = async (
  state: OnboardingAgentState,
) => {
  const nextQuestion = await generateOnboardingQuestionChain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
    dietInfo: transformObjectForPrompt(state.diet),
    missingQuestions: Object.keys(dietSchema.shape)
      .filter((key) => {
        if (state.agentScratchpad.includes(key)) {
          return false;
        }
        return true;
      })
      .join(", "),
  });

  console.log(
    "[generateOnboardingQuesiton] lastQuestion: ",
    nextQuestion,
    "\n",
  );

  return { lastQuestion: nextQuestion };
};
