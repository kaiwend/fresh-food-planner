import { AgentState, Intent } from "../base.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { z } from "zod";
import { RunnableSequence } from "langchain/core/runnables";
import { llmWithStructuredOutput } from "../utils.ts";

export const SUPERVISOR_NODE_NAME = "SUPERVISOR_NODE";

export const supervisorNode = async (state: AgentState) => {
  // if (!isDietFilled(state.diet)) {
  //   return { intent: "gather info" };
  // } else {
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

  const chain = RunnableSequence.from([promptTemplate, model]);
  const result = await chain.invoke({ input: state.input });

  console.log("[supervisor] INTENT: ", { result });

  return { intent: result.intent };
  // }
};

// const isDietFilled = (diet: AgentState["diet"]): boolean => {
//   console.log(
//     !!diet?.dietName,
//     !!diet?.allergies,
//     !!diet?.dislikes,
//     !!diet?.preferences,
//   );
//   return (
//     !!diet?.dietName &&
//     !!diet?.allergies &&
//     diet?.allergies?.length > 0 &&
//     !!diet?.dislikes &&
//     diet?.dislikes?.length > 0 &&
//     !!diet?.preferences &&
//     diet?.preferences?.length > 0
//   );
// };
