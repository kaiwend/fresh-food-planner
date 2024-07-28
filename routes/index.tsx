import { Handlers, PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { app } from "../graph/base.ts";
import { ChatForm } from "../islands/ChatForm.tsx";
import { useSignal } from "@preact/signals";

interface Data {
  threadId: string;
  messages: string[];
  state?: Record<string, unknown>;
  currentInput?: string;
  isLoading?: boolean;
}

const LOADING = "Loading";

const sessionId = crypto.randomUUID();

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const messages: string[] = [
      "👋",
      "Hi I can help you with planning your meals. What do you like to eat?",
    ];
    const threadId = crypto.randomUUID();
    return await ctx.render({ messages, threadId });
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const newMessage = formData.get("chat-message");
    const oldMessages = JSON.parse(
      formData.get("all-chat-messages") as string,
    ) as string[];
    const threadId = formData.get("thread-id") as string;
    const graphConfig = {
      configurable: {
        thread_id: threadId,
      },
      metadata: {
        session_id: sessionId,
      },
    };

    const graphState = await app.getState(graphConfig);
    const chatHistory = oldMessages.filter((message) => message !== LOADING);
    let result;
    if (!graphState.createdAt) {
      result = await app.invoke(
        { input: newMessage, chatHistory },
        graphConfig,
      );
    } else {
      await app.updateState(graphConfig, {
        input: newMessage,
        chatHistory,
        // asNode: ASK_HUMAN_ONBOARDING_NODE,
      });
      result = await app.invoke(null, graphConfig);
    }

    if (!newMessage || typeof newMessage !== "string")
      return await ctx.render({ threadId, messages: [] });

    const messages = [
      ...oldMessages.filter((message) => message !== LOADING),
      result.lastResponse,
    ];
    return await ctx.render({
      threadId,
      messages,
      isLoading: false,
      currentInput: "",
      state: result,
    });
  },
};

export default function ChatPage(props: PageProps<Data>) {
  const isLoading = useSignal(props.data.isLoading ?? false);
  const currentInput = useSignal(props.data.currentInput ?? "");
  const messages = useSignal(props.data.messages ?? []);

  return (
    <div className="w-[80vw] min-h-[80vh] mx-auto border-gray-800 rounded border-2 my-[10vh] px-4 py-4">
      <Partial name="all-chat-messages">
        <ChatForm
          threadId={props.data.threadId}
          messages={messages}
          isLoading={isLoading}
          currentInput={currentInput}
          currentState={props.data.state}
        />
      </Partial>
    </div>
  );
}
