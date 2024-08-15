import { ChatPromptTemplate } from "langchain/core/prompts";
import { z } from "zod";
import { RunnableSequence } from "langchain/core/runnables";
import { AgentState, Intent } from "../mainGraph.ts";
import { llmWithStructuredOutput } from "../../utils.ts";

export const SUPERVISOR_NODE_NAME = "SUPERVISOR_NODE";

export const supervisorNode = async (state: AgentState) => {
  if (!state.onboardingComplete) {
    return { intent: Intent.GATHER_INFO };
  }
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a supervisor for a team to plan, research and plan a user's diet. Your goal is to derive the user's intent. For context the process overall is to first obtain gather info about the user's diet, then doing some research on recipes and nutrition and generate a meal plan for a period of time afterwards.",
    ],
    ["user", "{input}"],
  ]);

  const outputSchema = z.object({
    intent: z.nativeEnum(Intent),
  });
  const model = llmWithStructuredOutput(outputSchema, "DecideIntent");

  const chain = RunnableSequence.from<
    Pick<AgentState, "input">,
    Pick<AgentState, "intent">
  >([promptTemplate, model]);
  const result = await chain.invoke({ input: state.input });

  console.log("[supervisor] intent: ", result.intent, "\n");

  return { intent: result.intent };
};
