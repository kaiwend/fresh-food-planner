import { RunnableSequence, Runnable } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import {
  AgentState,
  OnboardingSchema,
  onboardingSchema,
} from "../mainGraph.ts";
import {
  llmWithStructuredOutput,
  transformObjectForPrompt,
} from "../../utils.ts";

export const INITIAL_EXTRACTION_NODE_NAME = "initialDietDataExtraction";
export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: AgentState) => {
  const template = `You are an onboarding professional that is onboarding a user to a diet planner app.

You will receive the last pair of a chat history. Your goal is to extract information from those extracted information, merge that extracted information with some existing information. Decide when the onboarding is concluded. In case the user indicates that he put in enough information, conclude the onboarding by setting onboardingComplete to true.

Extract the diet information from the human response:
\`\`\`${state.input}\`\`\`

For context, the last question asked was:
\`\`\`${state.lastResponse}\`\`\`

Existing information to merge with:
\`\`\`
{dietInfo}
\`\`\`
`;
  const prompt: Runnable = PromptTemplate.fromTemplate(template);
  const model = llmWithStructuredOutput(onboardingSchema, "ExtractDietInfo");
  const chain = RunnableSequence.from<
    Pick<AgentState, "input" | "lastResponse"> & { dietInfo: string },
    OnboardingSchema
  >([prompt, model], "ExtractDietInfoChain");
  const result = await chain.invoke({
    input: state.input,
    lastResponse: state.lastResponse,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  console.group("[extractDietData]");
  console.log(`diet:\n${transformObjectForPrompt(result.diet)}\n`);
  console.log(`onboardingComplete: ${result.onboardingComplete}\n`);
  console.groupEnd();

  return { diet: result.diet, onboardingComplete: result.onboardingComplete };
};
