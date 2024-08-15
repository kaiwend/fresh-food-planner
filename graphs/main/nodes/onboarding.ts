import { ChatPromptTemplate } from "langchain/core/prompts";
import { MessagesPlaceholder } from "langchain/core/prompts";
import { RunnableSequence } from "langchain/core/runnables";
import { StringOutputParser } from "langchain/core/output_parsers";
import { AgentState } from "../mainGraph.ts";
import { llm, transformObjectForPrompt } from "../../utils.ts";

export const ONBOARDING_NODE_NAME = "ONBOARDING_NODE";

const behaviourInstructions = [
  "Be friendly and helpful",
  "Do not say what you like or not like",
  "Do not repeat what the user said, just briefly refer to it in a positive way before asking your question",
  "Do not list the already obtained information",
  "Obtain a piece of information at a time",
];

export const onboardingNode = async (state: AgentState) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a diet planner. Your goal is to interact with the user to obtain information about it's desired diet.

# Data format
You will receive the chatHistory and diet_info. diet_info is the information that was already obtained. It is in the format "preferences: ['vegan', 'mango', ...]\ndislikes: ...".

# Procedure
Check which info was already provided in the chat history and in diet_info. Generate a question to obtain info from the user. When you come to the conclusion, that all questions were asked, conclude the conversation by saying that we are done with gathering basic information. Try to ask questions to fill the already obtained information even more, but it is also ok to leave some empty if the user does not want to answer them.

# Style guidelines
${behaviourInstructions.map((instruction) => `${instruction}`).join("\n")}

# diet_info:
{dietInfo}
`,
    ],
    new MessagesPlaceholder("chatHistory"),
    ["user", "{input}"],
  ]);

  const model = llm();
  const chain = RunnableSequence.from<
    Pick<AgentState, "input" | "chatHistory"> & { dietInfo: string },
    AgentState["lastResponse"]
  >([promptTemplate, model, new StringOutputParser()], "OnboardingChain");

  const result = await chain.invoke({
    input: state.input,
    chatHistory: state.chatHistory,
    dietInfo: transformObjectForPrompt(state.diet),
  });

  console.log("[onboarding] lastResponse: ", result, "\n");

  return { lastResponse: result };
};
