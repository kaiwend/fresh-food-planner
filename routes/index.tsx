import { Handlers, PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { app } from "../graph/base.ts";
import { ChatForm } from "../islands/ChatForm.tsx";
import { useSignal } from "@preact/signals";
import { ASK_HUMAN_NODE } from "../graph/nodes/askHuman.ts";

interface Data {
  threadId: string;
  messages: string[];
  currentInput?: string;
  isLoading?: boolean;
}

const LOADING = "Loading";

const sessionId = crypto.randomUUID();

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    console.log("GET");
    const messages: string[] = [
      "👋",
      "Hi I can help you with planning your meals. What do you like to eat?",
    ];
    const threadId = crypto.randomUUID();
    console.log({ threadId });
    return await ctx.render({ messages, threadId });
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    // console.log({ formData });
    const newMessage = formData.get("chat-message");
    // console.log({ newMessage });
    // console.log(formData.get("all-chat-messages"));
    const oldMessages = JSON.parse(
      formData.get("all-chat-messages") as string,
    ) as string[];
    const threadId = formData.get("thread-id") as string;
    // console.log({ oldMessages });
    //
    // app.getGraph().drawMermaidPng()
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
      app.updateState(graphConfig, {
        values: { input: newMessage },
        asNode: ASK_HUMAN_NODE,
      });
      result = await app.invoke({ input: null }, graphConfig);
    }

    if (!newMessage || typeof newMessage !== "string")
      return await ctx.render({ threadId, messages: [] });

    const messages = [
      ...oldMessages.filter((message) => message !== LOADING),
      result.lastResponse,
    ];
    // console.log({ messages });
    return await ctx.render({
      threadId,
      messages,
      isLoading: false,
      currentInput: "",
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
        />
      </Partial>
    </div>
  );
}
