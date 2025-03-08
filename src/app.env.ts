export const getEnv = () => {
  // @ts-ignore
  if (typeof process !== "undefined" && process.env) {
    // @ts-ignore
    return process.env;
    // @ts-ignore
  } else if (typeof Deno !== "undefined" && Deno.env) {
    // @ts-ignore
    return Deno.env.toObject();
  } else {
    throw new Error("Unsupported runtime environment");
  }
};
