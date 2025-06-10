export const loader = () =>
  new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
