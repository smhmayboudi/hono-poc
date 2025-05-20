import { describe, expect, test } from "vitest";

import app from "./app";

describe("App Test", () => {
  test("Should GET /api", async () => {
    expect.assertions(2);
    const res = await app.request("/api");
    expect(res.status).toBe(200);
    expect(await res.json()).toStrictEqual({ message: "Hello" });
  });
});
