import { AgentState } from "../base.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { MessagesPlaceholder } from "langchain/core/prompts";
import { llm } from "../utils.ts";

export const ONBOARDING_NODE_NAME = "ONBOARDING_NODE";

export const onboardingNode = async (state: AgentState) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a diet planner onboarder. Your goal is to interact with the user to obtain information about the diet that is being aimed for.",
    ],
    ["user", "{input}"],
    new MessagesPlaceholder("chatHistory"),
  ]);

  const model = llm();
  const chain = promptTemplate.pipe(model);
  // const chain = RunnableSequence.from([promptTemplate, model]);
  const result = await chain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
  });
  // console.log({ result: result.content });

  return { lastResponse: result.content as string };
};
