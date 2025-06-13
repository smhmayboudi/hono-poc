export const loader = () =>
  new Response(null, {
    headers: { "Content-Type": "application/json" },
    status: 204,
  });
