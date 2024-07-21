import { z } from "https://esm.sh/zod@3.23.8";
import { ChatOpenAI } from "langchain/openai";

export const llmWithStructuredOutput = (
  structuredOutput: z.ZodObject,
  functionName: string,
) =>
  llm().withStructuredOutput(structuredOutput, {
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
