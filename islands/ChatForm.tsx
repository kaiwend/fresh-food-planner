import { Signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";
import { OnboardingAgentState } from "@/ai/graphs/onboarding/graph.ts";

interface ChatFormProps {
  threadId: string;
  sessionId: string;
  currentState: OnboardingAgentState;
  messages: Signal<string[]>;
  currentInput: Signal<string>;
  isLoading: Signal<boolean>;
}

export const ChatForm = (props: ChatFormProps) => {
  return (
    <>
      <div className="flex flex-col h-[75vh] gap-2 my-2 overflow-y-scroll no-scrollbar">
        {props.messages.value.map((message, index) => (
          <div
            className={index % 2 === 0 ? "chat chat-start" : "chat chat-end"}
          >
            {index % 2 !== 0 && (
              <div className="chat-image avatar">
                <div className="w-20 rounded-full">
                  <img alt="AI Avatar" src="/avatar.png" />
                </div>
              </div>
            )}
            <div
              className={
                index % 2 === 0
                  ? "chat-bubble chat-bubble-primary"
                  : "chat-bubble chat-bubble-secondary mb-8"
              }
            >
              {message === "Loading" ? (
                <div className="loading loading-dots loading-md"></div>
              ) : (
                message
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        id="chat"
        onSubmit={() => {
          props.isLoading.value = true;
          props.messages.value = [
            ...props.messages.value,
            props.currentInput.value,
            "Loading",
          ];
        }}
        className="w-full flex"
      >
        <input
          type="text"
          name="chat-message"
          className="grow border-2 border-black px-2 mr-2"
          value={props.currentInput}
          onChange={(e) => {
            props.currentInput.value = e.currentTarget.value;
            e.currentTarget.focus();
          }}
        />
        <input type="hidden" name="thread-id" value={props.threadId} />
        <input type="hidden" name="session-id" value={props.sessionId} />
        <input
          type="hidden"
          name="all-chat-messages"
          value={JSON.stringify(props.messages)}
        />
        <div className="flex gap-1">
          {props.currentState?.onboardingComplete && (
            <a
              className="btn btn-secondary rounded disabled:btn-disabled"
              href={`/${props.sessionId}/plan`}
              disabled={props.isLoading.value}
            >
              Start Planning
            </a>
          )}
          <button
            className="btn btn-primary rounded disabled:btn-disabled"
            type="submit"
            form="chat"
            formaction={`/${props.sessionId}/onboarding`}
            f-partial={`/${props.sessionId}/onboarding`}
            formmethod="POST"
            disabled={props.isLoading.value}
          >
            Send
          </button>
        </div>
      </form>
    </>
  );
};
