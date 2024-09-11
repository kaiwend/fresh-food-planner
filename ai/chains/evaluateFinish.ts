import { RunnableSequence, Runnable } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import { llmWithStructuredOutput } from "@/ai/graphs/utils.ts";
import { dietSchema } from "@/types/diet.ts";
import { z } from "zod";

type EvaluateFinishInput = {
  lastQuestion: string;
  missingQuestions: string;
};

type EvaluateFinishOutput = {
  onboardingComplete: boolean;
  agentScratchpad: string;
};

const evaluateFinishSchema = z.object({
  onboardingComplete: z
    .boolean()
    .describe("Is true when there are no missing questions left"),

  agentScratchpad: z.optional(
    z
      .string()
      .describe(
        `Classify the question that was asked to one of the following: ${Object.keys(
          dietSchema.shape,
        ).join(", ")}. And ONLY one of them.`,
      ),
  ),
});

const template = `
You are an onboarding professional that is onboarding a user to a diet planner app. Your goal is to determine if all questions were asked. If all questions were asked or the last question does not contain a question, the onboarding is finished.

Last question asked:
\`\`\`{lastQuestion}\`\`\

Questions missing:
\`\`\`{missingQuestions}\`\`\`
`;
const prompt: Runnable = PromptTemplate.fromTemplate(template);
const model = llmWithStructuredOutput(evaluateFinishSchema, "EvaluateFinish", {
  temperature: 0.0,
});

export const evaluateFinishChain = RunnableSequence.from<
  EvaluateFinishInput,
  EvaluateFinishOutput
>([prompt, model], "EvaluateFinishChain");
