import { serve } from "@hono/node-server";
import { loadConfig } from "@conquest/config";
import { createApp } from "./app.js";

const config = loadConfig();
const app = createApp(config);

serve({ fetch: app.fetch, port: config.port }, () => {
  console.log(JSON.stringify({ event: "conquest_started", port: config.port, env: config.nodeEnv }));
});
