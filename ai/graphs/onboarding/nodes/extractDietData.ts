import { transformObjectForPrompt } from "@/ai/graphs/utils.ts";
import { extractDietDataChain } from "@/ai/chains/extractDietData.ts";
import { evaluateFinishChain } from "@/ai/chains/evaluateFinish.ts";
import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";

export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: OnboardingAgentState) => {
  const extractedDiet = await extractDietDataChain.invoke({
    input: state.input,
    lastQuestion: state.lastQuestion,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  const { onboardingComplete, agentScratchpad } =
    await evaluateFinishChain.invoke({
      input: state.input,
      lastQuestion: state.lastQuestion,
      agentScratchpad: state.agentScratchpad,
    });

  console.group("[extractDietData]");
  console.log(`diet:\n${transformObjectForPrompt(extractedDiet)}\n`);
  console.log(`onboardingComplete: ${onboardingComplete}\n`);
  console.groupEnd();

  return {
    diet: extractedDiet,
    onboardingComplete,
    agentScratchpad,
  };
};
