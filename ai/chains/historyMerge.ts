import { llm } from "@/ai/graphs/utils.ts";
import { RunnableSequence } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import { StringOutputParser } from "langchain/core/output_parsers";

type HistoryMergeChainInput = {
  existingSummary: string;
  newChatMessage: string;
};

type HistoryMergeChainOutput = string;

const prompt = PromptTemplate.fromTemplate(
  `You are an expert in chat history merging. You will receive an existing summary and a new chat message. Your goal is to create a new summary out of the both, adding the info from the new chat message to it. It is a summar of what a user said during onboarding for a meal planner app. The new message is also from the user. Focus on what the user wants and what should be excluded. Omit information regarding thanking. Just output the summary and nothing else.

# Existing summary:
\`\`\`
{existingSummary}
\`\`\`

# New chat message:
\`\`\`
user: {newChatMessage}
\`\`\``,
);

const model = llm();

export const historyMergeChain = RunnableSequence.from<
  HistoryMergeChainInput,
  HistoryMergeChainOutput
>([prompt, model, new StringOutputParser()]);
