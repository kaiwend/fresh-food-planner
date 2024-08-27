import { ComponentChildren } from "https://esm.sh/v128/preact@10.19.6/src/index.js";

const Card = (props: { title: string; children: ComponentChildren }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[380px]">
    <div className="flex flex-col space-y-1.5 p-6">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">
        {props.title}
      </h3>
    </div>
    {props.children}
  </div>
);

export default Card;
