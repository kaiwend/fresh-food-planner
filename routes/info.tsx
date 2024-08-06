import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
};

export default function Info() {
  return (
    <div>
      <h1>Info</h1>
      <img src="graph.png" alt="png image of graph" />
    </div>
  );
}
