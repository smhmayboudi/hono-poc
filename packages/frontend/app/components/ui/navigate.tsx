import { useMemo } from "react";
import {
  Navigate as ReactRouterNavigate,
  type NavigateProps as ReactRouterNavigateProps,
  useSearchParams,
} from "react-router";

import type { Language } from "~/localization/resource";

export interface NavigateProps extends ReactRouterNavigateProps {
  keepSearchParams?: boolean;
  language?: Language;
}

/**
 * Enhances the default to prop by adding the language to the search params and conditionally keeping the search params
 * @param language The language to use over the search param language
 * @param to The new location to navigate to
 * @param keepSearchParams Whether to keep the search params or not
 *
 * @example
 * ```tsx
 * // override the language
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ language: "en", to: "/" })
 * 	return <Navigate to={enhancedTo} /> // Will navigate to /?lng=en even if the current url contains a different lanugage
 * }
 *
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ to: "/" })
 * 	return <Navigate to={enhancedTo} /> // Will navigate to /?lng=X where X is the current language in the url search params, or just to / if no language is found
 * }
 *
 * function Component(){
 * 	const enhancedTo = useEnhancedTo({ to: "/", keepSearchParams: true })
 * 	return <Navigate to={enhancedTo} /> // Will navigate to /?params=from_the_url_search_params&lng=en
 * }
 * ```
 */
export const useEnhancedTo = ({
  keepSearchParams,
  language,
  to,
}: NavigateProps) => {
  const [params] = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, ...searchParams } = Object.fromEntries(params.entries());
  const newSearchParams = new URLSearchParams(searchParams);
  const newSearchParamsString = newSearchParams.toString();
  const newLng = language ?? params.get("lng");
  const appendSearchParams = !!newSearchParamsString || !!newLng;
  const newPath = useMemo(
    () =>
      to +
      (appendSearchParams
        ? // eslint-disable-next-line sonarjs/no-nested-template-literals
          `?${[keepSearchParams && !!newSearchParamsString && newSearchParamsString, !!newLng && `lng=${newLng}`].filter(Boolean).join("&")}`
        : ""),
    [to, appendSearchParams, keepSearchParams, newSearchParamsString, newLng],
  );

  return newPath;
};

export const Navigate = ({
  keepSearchParams = false,
  language,
  to,
  ...props
}: NavigateProps) => {
  const enhancedTo = useEnhancedTo({ keepSearchParams, language, to });

  return <ReactRouterNavigate to={enhancedTo} {...props} />;
};
