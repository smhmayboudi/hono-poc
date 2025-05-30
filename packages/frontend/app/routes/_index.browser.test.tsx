import { describe, expect, it } from "vitest";

import Module from "~/routes/_index";

const routeComponentProps = {
  loaderData: {
    extra: "extra",
    showBanner: false,
    url: "url",
  },
  params: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: [] as any,
};
describe("Home route", () => {
  it("should render the home page text properly in english", async ({
    renderStub,
  }) => {
    const { getByText } = await renderStub({
      entries: [
        {
          id: "home",
          path: "/",
          Component: () => Module(routeComponentProps),
        },
      ],
    });

    expect(
      getByText("React Router is awesome!", {
        exact: false,
      }),
    ).not.toBeNull();
  });

  it("should render the home page text properly in bosnian", async ({
    renderStub,
  }) => {
    const { getByText } = await renderStub({
      entries: [
        {
          id: "home",
          path: "/",

          Component: () => Module(routeComponentProps),
        },
      ],
      i18n: {
        lng: "fa",
      },
    });

    expect(
      getByText("React Router je zakon!", {
        exact: false,
      }),
    ).not.toBeNull();
  });
});
