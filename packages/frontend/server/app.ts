import { Hono } from "hono";

import i18nextOpts from "../app/localization/i18n.server";
import type { Env } from "./app.env";
import { i18next } from "./app.i18next";

const app = new Hono<Env>();

app.use(i18next(i18nextOpts));

app.get("/api", (ctx) => ctx.json({ message: "Hello" }));

export default app;
