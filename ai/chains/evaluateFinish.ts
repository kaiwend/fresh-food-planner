import { RunnableSequence, Runnable } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import { llmWithStructuredOutput } from "@/ai/graphs/utils.ts";
import { dietSchema } from "@/types/diet.ts";
import { z } from "zod";

type EvaluateFinishInput = {
  input: string;
  lastQuestion: string;
  agentScratchpad: string;
};

type EvaluateFinishOutput = {
  onboardingComplete: boolean;
  agentScratchpad: string;
};

const evaluateFinishSchema = z.object({
  onboardingComplete: z
    .boolean()
    .default(false)
    .describe("Indicates whether all questions were asked"),
  agentScratchpad: z.string().describe("Question that was asked"),
});

const template = `
You are assisting a diet planner and receive the last question that was asked and the last response from the user. Your goal is to note down the question that was asked on the agentScratchpad. Also decide if the onboarding is complete. Onboarding is complete, once there was a question asked for each of the following: ${Object.keys(
  dietSchema,
).join(", ")}

Last question asked:
\`\`\`{lastQuestion}\`\`\
Last response:
\`\`\`{input}\`\`\`
Already asked questions:
\`\`\`{agentScratchpad}\`\`\`
`;
const prompt: Runnable = PromptTemplate.fromTemplate(template);
const model = llmWithStructuredOutput(evaluateFinishSchema, "EvaluateFinish");

export const evaluateFinishChain = RunnableSequence.from<
  EvaluateFinishInput,
  EvaluateFinishOutput
>([prompt, model], "EvaluateFinishChain");
