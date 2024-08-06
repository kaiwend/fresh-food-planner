import { AgentState } from "../base.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { MessagesPlaceholder } from "langchain/core/prompts";
import { llm } from "../utils.ts";
import { StringOutputParser } from "langchain/core/output_parsers";
import { Runnable } from "https://esm.sh/v135/@langchain/core@0.2.10/runnables.js";

export const ONBOARDING_NODE_NAME = "ONBOARDING_NODE";

export const onboardingNode = async (state: AgentState) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a diet planner onboarder. Your goal is to interact with the user to obtain information about the diet that is being aimed for. Check which parts were already asked for. Generate a question to obtain a goal, dislikes, allergies and preferences. But only ask for one thing at a time.",
    ],
    new MessagesPlaceholder("chatHistory"),
    ["user", "{input}"],
  ]);

  const model: Runnable = llm();
  const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());
  // const chain = RunnableSequence.from([promptTemplate, model]);
  const result = await chain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
  });
  // console.log({ result: result.content });

  return { lastResponse: result };
};
