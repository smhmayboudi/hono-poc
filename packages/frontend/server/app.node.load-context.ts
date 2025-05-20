type GetLoadContextArgs = {
  request: Request;
};

declare module "react-router" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    url: string;
    extra: string;
  }
}

export const getLoadContext = (args: GetLoadContextArgs) => {
  return {
    extra: "stuff",
    url: args.request.url,
  };
};
