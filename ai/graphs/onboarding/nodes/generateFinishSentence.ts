import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";
import { ChatPromptTemplate } from "langchain/core/prompts";
import { MessagesPlaceholder } from "langchain/core/prompts";
import { RunnableSequence } from "langchain/core/runnables";
import { llm } from "@/ai/graphs/utils.ts";
import { StringOutputParser } from "langchain/core/output_parsers";

export const GENERATE_FINISH_SENTENCE_NODE_NAME =
  "GENERATE_FINISH_SENTENCE_NODE_NAME";

export const generateFinishSentence = async (state: OnboardingAgentState) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a meal planner onboarding assistant. Your goal is to lead the user to the next step by letting him know that the onboarding is finished. He can still add info, but once there is nothing to add he should click the Start planning button below.",
    ],
    new MessagesPlaceholder("chatHistory"),
  ]);

  const model = llm();

  const generateFinishSentenceChain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const result = await generateFinishSentenceChain.invoke({
    chatHistory: state.chatHistory,
  });

  return { lastQuestion: result };
};
