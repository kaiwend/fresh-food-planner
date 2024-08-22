import { AgentState } from "@/ai/graphs/main/mainGraph.ts";
import { transformObjectForPrompt } from "@/ai/graphs/utils.ts";
import { extractDietDataChain } from "@/ai/chains/extractDietData.ts";
import { evaluateFinishChain } from "@/ai/chains/evaluateFinishCHain.ts";

export const INITIAL_EXTRACTION_NODE_NAME = "initialDietDataExtraction";
export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: AgentState) => {
  const extractedDiet = await extractDietDataChain.invoke({
    input: state.input,
    lastResponse: state.lastResponse,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  const { onboardingComplete, agentScratchpad } =
    await evaluateFinishChain.invoke({
      input: state.input,
      lastResponse: state.lastResponse,
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
