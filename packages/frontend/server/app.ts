import { Hono } from "hono";

import { Env } from "./app.env";

const app = new Hono<Env>();

app.get("/api", (ctx) => ctx.json({ message: "Hello" }));

export default app;
