import { llmWithStructuredOutput } from "@/ai/graphs/utils.ts";
import { RunnableSequence } from "langchain/core/runnables";
import { PromptTemplate } from "langchain/core/prompts";
import {
  RecipeFinderInput,
  recipeQuerySchema,
} from "@/services/RecipeFinder.ts";

type RecipeFinderQueryChainInput = {
  conversationSummary: string;
};

type RecipeFinderQueryChainOutpuy = RecipeFinderInput;

const prompt = PromptTemplate.fromTemplate(
  `You are an expert in creating queries for recipe search engines. Your goal is to look at the summary of a conversation that was aimed to obtain a user's diet preferences. Try to derive as much as makes sense. It is fine to leave properties empty.

# conversation summary:
{conversationSummary}`,
);

const model = llmWithStructuredOutput(recipeQuerySchema, "RecipeFinderQuery");

export const recipeFinderQueryChain = RunnableSequence.from<
  RecipeFinderQueryChainInput,
  RecipeFinderQueryChainOutpuy
>([prompt, model]);
