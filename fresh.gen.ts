// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_sessionId_onboarding from "./routes/[sessionId]/onboarding.tsx"
import * as $_sessionId_plan from "./routes/[sessionId]/plan.tsx"
import * as $_404 from "./routes/_404.tsx"
import * as $_app from "./routes/_app.tsx"
import * as $index from "./routes/index.tsx"
import * as $info from "./routes/info.tsx"
import * as $ChatForm from "./islands/ChatForm.tsx"
import { type Manifest } from "$fresh/server.ts"

const manifest = {
  routes: {
    "./routes/[sessionId]/onboarding.tsx": $_sessionId_onboarding,
    "./routes/[sessionId]/plan.tsx": $_sessionId_plan,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
    "./routes/info.tsx": $info,
  },
  islands: {
    "./islands/ChatForm.tsx": $ChatForm,
  },
  baseUrl: import.meta.url,
} satisfies Manifest

export default manifest
