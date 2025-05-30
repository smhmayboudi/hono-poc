import { describe, expect, it } from "vitest";

import { twc } from "~/utils/css";

describe("twc", () => {
  it("should merge classes", () => {
    expect.assertions(1);
    const classes = ["class1", "class2"];
    const result = twc(...classes);
    expect(result).toBe("class1 class2");
  });

  it("should merge classes with undefined", () => {
    expect.assertions(1);
    const classes = ["class1", undefined, "class2"];
    const result = twc(...classes);
    expect(result).toBe("class1 class2");
  });

  it("should merge classes with empty string", () => {
    expect.assertions(1);
    const classes = ["class1", "", "class2"];
    const result = twc(...classes);
    expect(result).toBe("class1 class2");
  });

  it("should remove duplicates", () => {
    expect.assertions(1);
    const classes = ["mb-1", "mb-2"];
    const result = twc(...classes);
    expect(result).toBe("mb-2");
  });
});
