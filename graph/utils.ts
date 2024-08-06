import { Runnable } from "https://esm.sh/v135/@langchain/core@0.2.10/runnables.js";
import { z, ZodTypeAny } from "https://esm.sh/zod@3.23.8";
import { ChatOpenAI } from "langchain/openai";

export const llmWithStructuredOutput = <
  T extends z.ZodObject<Record<string, ZodTypeAny>>,
>(
  structuredOutput: T,
  functionName: string,
) =>
  llm().withStructuredOutput<T>(structuredOutput, {
    name: functionName,
  });

export const llm = (options?: {
  temperature?: number;
  model?: string;
  quality?: number;
  latency?: number;
  costs?: number;
}) =>
  new ChatOpenAI({
    temperature: options?.temperature ?? 0.5,
    model: "router",
    apiKey: Deno.env.get("AI_ROUTER_API_KEY"),
    configuration: {
      baseURL: "https://api.airouter.io",
    },
    modelKwargs: {
      weighting: {
        ...(options?.quality && { quality: options.quality }),
        ...(options?.latency && { latency: options.latency }),
        ...(options?.costs && { costs: options.costs }),
      },
    },
  });
