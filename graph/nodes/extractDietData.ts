import { AgentState, dietSchema } from "../base.ts";
import { llmWithStructuredOutput } from "../utils.ts";
import { PromptTemplate } from "langchain/core/prompts";

export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: AgentState) => {
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

  console.log({ result });

  return { diet: result };
};
