import { ComponentChildren } from "https://esm.sh/v128/preact@10.19.6/src/index.js";

interface CardProps {
  children: ComponentChildren;
  size?: "small" | "medium" | "large";
}

const Card = ({ children, size }: CardProps) => {
  const sizeClass = () => {
    switch (size) {
      case "small":
        return "w-[380px]";
      case "medium":
        return "w-[780px]";
      case "large":
        return "w-[1080px]";
      default:
        return "w-[380px]";
    }
  };
  return (
    <div className={`card bg-base-100 pt-5 shadow-xl ${sizeClass()}`}>
      {children}
    </div>
  );
};

export default Card;
