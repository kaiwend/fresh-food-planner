import { RunnableSequence, Runnable } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import { llmWithStructuredOutput } from "@/ai/graphs/utils.ts";
import { dietSchema, type Diet } from "@/types/diet.ts";

type ExtractDietDataChainInput = {
  input: string;
  lastQuestion: string;
  dietInfo: string;
};

const template = `You are an onboarding professional that is onboarding a user to a diet planner app.

You will receive the last pair of a chat history. Your goal is to extract information from those extracted information, merge that extracted information with some existing information. Preserve as much detail and refrain from losing any information at all cost.

Extract the diet information from the human response:
\`\`\`{input}\`\`\`

For context, the last question asked was:
\`\`\`{lastQuestion}\`\`\`

Existing information to merge with:
\`\`\`
{dietInfo}
\`\`\`
`;
const prompt: Runnable = PromptTemplate.fromTemplate(template);
const model = llmWithStructuredOutput(dietSchema, "ExtractDietInfo", {
  latency: 2.0,
});

export const extractDietDataChain = RunnableSequence.from<
  ExtractDietDataChainInput,
  Diet
>([prompt, model], "ExtractDietInfoChain");
