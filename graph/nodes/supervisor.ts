import { AgentState, Intent } from "../base.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { z } from "https://esm.sh/zod@3.23.8";
import { llmWithStructuredOutput } from "../utils.ts";

export const SUPERVISOR_NODE_NAME = "SUPERVISOR_NODE";

export const supervisorNode = async (state: AgentState) => {
  if (!isDietFilled(state.diet)) {
    return { intent: "gather info" };
  } else {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a diet planner supervisor. Ask the user for it's intent.",
      ],
      ["user", "{input}"],
      // new MessagesPlaceholder(state.input),
    ]);

    const outputSchema = z.object({
      intent: z.nativeEnum(Intent),
    });
    const model = llmWithStructuredOutput(outputSchema, "DecideIntent");

    const chain = promptTemplate.pipe(model);
    // const chain = RunnableSequence.from([promptTemplate, model]);
    const result = await chain.invoke({ input: state.input });
    // console.log({ result });

    return { intent: result.intent };
  }
};

const isDietFilled = (diet: AgentState["diet"]): boolean => {
  return (
    !!diet.dietName &&
    !!diet.allergies &&
    diet.allergies?.length > 0 &&
    !!diet.dislikes &&
    diet.dislikes?.length > 0 &&
    !!diet.preferences &&
    diet.preferences?.length > 0
  );
};
