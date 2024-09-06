import { llm } from "@/ai/graphs/utils.ts";
import { RunnableSequence } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import { StringOutputParser } from "langchain/core/output_parsers";

type HistorySummaryChainInput = {
  chatHistory: string;
};

type HistorySummaryChainOutput = string;

const prompt = PromptTemplate.fromTemplate(
  `You are an expert in chat history summarization. Your goal is to summarize the provided chat history with focus on what the user said. Preserve as much detail as possible. 

# Chat history:
{chatHistory}`,
);

const model = llm();

export const historySummaryChain = RunnableSequence.from<
  HistorySummaryChainInput,
  HistorySummaryChainOutput
>([prompt, model, new StringOutputParser()]);
