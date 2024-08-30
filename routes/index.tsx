import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const sessionId = crypto.randomUUID();
    const headers = new Headers();
    headers.set("location", `/${sessionId}/onboarding`);
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
