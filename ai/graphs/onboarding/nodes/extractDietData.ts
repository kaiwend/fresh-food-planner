import { transformObjectForPrompt } from "@/ai/graphs/utils.ts";
import { extractDietDataChain } from "@/ai/chains/extractDietData.ts";
import { evaluateFinishChain } from "@/ai/chains/evaluateFinish.ts";
import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";
import { dietSchema } from "@/types/diet.ts";

export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: OnboardingAgentState) => {
  const extractedDiet = await extractDietDataChain.invoke({
    input: state.input,
    lastQuestion: state.lastQuestion,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  const { onboardingComplete, agentScratchpad } =
    await evaluateFinishChain.invoke({
      lastQuestion: state.lastQuestion,
      missingQuestions: Object.keys(dietSchema.shape)
        .filter((key) => {
          if (state.agentScratchpad.includes(key)) {
            return false;
          }
          return true;
        })
        .join(", "),
    });

  console.group("[extractDietData]");
  console.log(`diet:\n${transformObjectForPrompt(extractedDiet)}`);
  console.log(`onboardingComplete: ${onboardingComplete}`);
  console.groupEnd();

  return {
    diet: extractedDiet,
    onboardingComplete,
    // sometimes agenstScratchpad contains multiple items, we just want one
    agentScratchpad: [
      agentScratchpad.includes(",")
        ? agentScratchpad.split(",")[0]
        : agentScratchpad,
    ],
  };
};
