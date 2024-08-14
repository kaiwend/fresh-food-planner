import { AgentState } from "../base.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { MessagesPlaceholder } from "langchain/core/prompts";
import { llm } from "../utils.ts";
import { RunnableSequence } from "langchain/core/runnables";
import { StringOutputParser } from "langchain/core/output_parsers";

export const ONBOARDING_NODE_NAME = "ONBOARDING_NODE";

export const onboardingNode = async (state: AgentState) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a diet planner. Your goal is to interact with the user to obtain information about it's desired diet. Check which info was already asked for and provided. Generate a question to obtain a piece of information at a time. Don't repeat all of what the user said before, just briefly refer to it positively at first.",
    ],
    new MessagesPlaceholder("chatHistory"),
    ["user", "{input}"],
  ]);

  const model = llm();
  const chain = RunnableSequence.from<
    {
      input: AgentState["input"];
      chatHistory: AgentState["chatHistory"];
    },
    AgentState["lastResponse"]
  >([promptTemplate, model, new StringOutputParser()], "OnboardingChain");

  const result = await chain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
  });
  // console.log({ result: result.content });

  return { lastResponse: result };
};
