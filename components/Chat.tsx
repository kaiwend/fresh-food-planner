interface ChatProps {
  messages: string[];
}

const Chat = (props: ChatProps) => {
  return (
    <div>
      <div className="">
        {props.messages.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <form className="">
        <input type="text" className="" placeholder="Enter chat message" />
      </form>
    </div>
  );
};

export default Chat;
