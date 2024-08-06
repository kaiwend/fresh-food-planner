import { AgentState, dietSchema } from "../../base.ts";
import { llmWithStructuredOutput } from "../../utils.ts";
import { PromptTemplate } from "langchain/core/prompts";

export const ASK_HUMAN_ONBOARDING_NODE = "askHumanOnboarding";

// AI generated a question before which is set to the state
// We now get the human response and need to extract information from it
export const askHumanOnboardingNode = async (state: AgentState) => {
  const template =
    `Extract the diet information from the human response: ${state.input}

For context, the last question asked was: ${state.lastResponse}
`;
  const prompt = PromptTemplate.fromTemplate(template);
  const model = llmWithStructuredOutput(dietSchema, "ExtractDietInfo");

  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    input: state.input,
    lastResponse: state.lastResponse,
  });

  return { diet: result };
};
