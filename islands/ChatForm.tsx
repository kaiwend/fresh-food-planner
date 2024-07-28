import { Signal } from "https://esm.sh/v135/@preact/signals-core@1.5.1/dist/signals-core.js";

interface ChatFormProps {
  threadId: string;
  currentState: Record<string, unknown>;
  messages: Signal<string[]>;
  currentInput: Signal<string>;
  isLoading: Signal<boolean>;
}

export const ChatForm = (props: ChatFormProps) => {
  const messageClasses = "rounded px-4 py-2";

  return (
    <>
      <div>
        <h2>State:</h2>
        <div className="flex flex-col">
          <div>Input: {props.currentState?.input}</div>
          <div>LastResponse: {props.currentState?.lastResponse}</div>
          <div>Diet: {JSON.stringify(props.currentState?.diet)}</div>
        </div>
      </div>
      <hr className="border-black" />
      <div className="flex flex-col h-[70vh] gap-2 my-2 overflow-y-scroll no-scrollbar">
        {props.messages.value.map((message, index) => (
          <div
            className={
              index % 2 === 0
                ? `bg-blue-300 self-start mr-14 ${messageClasses}`
                : `bg-red-300 self-end ml-14 ${messageClasses}`
            }
          >
            {message}
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
        <input
          type="hidden"
          name="all-chat-messages"
          value={JSON.stringify(props.messages)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-400"
          type="submit"
          form="chat"
          formaction="/"
          f-partial="/"
          formmethod="POST"
          disabled={props.isLoading.value}
        >
          Send
        </button>
      </form>
    </>
  );
};
