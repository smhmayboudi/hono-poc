import husky from "husky";

// Skip Husky install in production and CI
if (process.env["CI"] === "true" || process.env["NODE_ENV"] === "production") {
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
}
console.log(husky());
