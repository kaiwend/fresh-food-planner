import { Handlers, PageProps } from "$fresh/server.ts";
import { app } from "../graph/base.ts";

interface Data {
  png: ArrayBuffer;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render();
  },
};

export default async function Info(props: PageProps<Data>) {
  return (
    <div>
      <h1>Info</h1>
      <img src="graph.png" alt="png image of graph" />
    </div>
  );
}
