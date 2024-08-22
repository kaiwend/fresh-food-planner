import { z, ZodTypeAny } from "zod";
import { ChatOpenAI } from "langchain/openai";
import { BaseCheckpointSaver } from "langchain/langgraph";

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

type StringOrEmpty = string | null | undefined;
type StringOrEmptyOrStringOrEmptyArray = StringOrEmpty | StringOrEmpty[];
type StructuredOutput = Record<
  string,
  | StringOrEmptyOrStringOrEmptyArray
  | Record<string, StringOrEmptyOrStringOrEmptyArray>
>;
type CleanedOutput = Record<
  string,
  string | string[] | Record<string, string | string[]>
>;

const isValueFilled = (
  value:
    | StringOrEmptyOrStringOrEmptyArray
    | Record<string, StringOrEmptyOrStringOrEmptyArray>,
): value is string | string[] | Record<string, string | string[]> => {
  if (value === "" || value === null || value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    const filtered = value.filter(isValueFilled);
    return filtered.length > 0;
  }
  if (typeof value === "object") {
    return Object.values(value).filter(isValueFilled).length > 0;
  }
  return true;
};

export const cleanObject = (obj: StructuredOutput): CleanedOutput =>
  Object.entries(obj).reduce<CleanedOutput>((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      const cleanedValue = cleanObject(value);
      if (Object.keys(cleanedValue).length > 0) {
        acc[key] = cleanedValue as Record<string, string | string[]>;
        return acc;
      }
    }
    if (isValueFilled(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});

export const transformObjectForPrompt = (
  obj: StructuredOutput | null,
): string => {
  if (!obj) {
    return "";
  }

  const cleanedObject = cleanObject(obj);
  // Check if object is empty
  if (Object.keys(cleanedObject).length === 0) {
    return "";
  }

  return Object.entries(cleanObject(obj))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(", ")}`;
      } else if (typeof value === "object") {
        return [key, transformObjectForPrompt(value)];
      }
      return `${key}: ${value}`;
    })
    .join("\n");
};

// export class DenoKvSaver extends BaseCheckpointSaver {
//   async getTuple(config: RunnableConfig): Promise<CheckpointTuple | undefined> {
//     const { thread_id, checkpoint_id  } = config.configurable || {}
//
//     const kv = await Deno.openKv("/_storage");
//     try {
//       if (checkpoint_id) {
//
//       }
//     }
//   }
// }
