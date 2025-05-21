type GetLoadContextArgs = {
  request: Request;
};

declare module "react-router" {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    extra: string;
    url: string;
  }
}

export const getLoadContext = (args: GetLoadContextArgs) => {
  return {
    extra: "stuff",
    url: args.request.url,
  };
};
