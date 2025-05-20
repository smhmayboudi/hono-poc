import { Hono } from "hono";

const app = new Hono();

app.get("/api", (ctx) => ctx.json({ message: "Hello" }));

export default app;
