import { RunnableSequence } from "langchain/core/runnables";
import { AgentState, dietSchema } from "../base.ts";
import { llmWithStructuredOutput, transformObjectForPrompt } from "../utils.ts";
import { PromptTemplate } from "langchain/core/prompts";

export const EXTRACT_DIET_DATA_NODE_NAME = "extractDietData";

export const extractDietData = async (state: AgentState) => {
  const template = `Your goal is to extract information from the following
Extract the diet information from the human response:
\`\`\`${state.input}\`\`\`

For context, the last question asked was:
\`\`\`${state.lastResponse}\`\`\`

After that use that information to merge it with the existing information. The information above is more recent. If it contradicts, prefer the newest one over the existing. Preserve as much information as possible.

Existing information:
\`\`\`
{dietInfo}
\`\`\`
`;
  const prompt = PromptTemplate.fromTemplate(template);
  const model = llmWithStructuredOutput(dietSchema, "ExtractDietInfo");
  const chain = RunnableSequence.from<
    Pick<AgentState, "input" | "lastResponse"> & { dietInfo: string },
    Pick<AgentState, "diet">
  >([prompt, model], {
    name: "ExtractDietDataChain",
  });
  // const chain = prompt.pipe(model);
  const result = await chain.invoke({
    input: state.input,
    lastResponse: state.lastResponse,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  console.log({ result });

  return { diet: result };
};
