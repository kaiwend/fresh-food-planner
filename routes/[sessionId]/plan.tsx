import { Handlers, PageProps } from "$fresh/server.ts";
import { Diet } from "../../graphs/main/mainGraph.ts";

interface Data {
  diet: Diet;
}

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    const sessionId = ctx.params.sessionId;
    const kv = await Deno.openKv();
    const diet = await kv.get([sessionId, "diet"]);

    return ctx.render({ diet: diet.value as Diet });
  },
};

const PlanPage = (props: PageProps<Data>) => {
  return <div>PlanPage: {JSON.stringify(props.data)}</div>;
};

export default PlanPage;
