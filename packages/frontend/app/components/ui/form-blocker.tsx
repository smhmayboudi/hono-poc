import { useCallback, useEffect, useRef, useState } from "react";
import { Blocker, useBlocker, useFetcher } from "react-router";

import Button from "~/components/ui/button";

interface FormBlockerProps {
  blocker: Blocker;
}

export const useFormBlocker = (fetcher: ReturnType<typeof useFetcher>) => {
  const [isDirty, setIsDirty] = useState(false);
  const blocker = useBlocker(useCallback(() => isDirty, [isDirty]));
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.data) {
      if (blocker.state === "blocked") {
        blocker.proceed();
      } else {
        formRef.current?.reset();
      }
    }
  }, [fetcher.data, blocker]);

  return {
    blocker,
    formRef,
    isDirty,
    setIsDirty,
  };
};

export const FormBlocker = ({ blocker }: FormBlockerProps) => {
  if (blocker.state !== "blocked") {
    return null;
  }

  return (
    <div role="alert" className="alert alert-warning">
      <svg
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span>Wait! You didn't submit the form.</span>
      <div className="join">
        <Button
          c_size="xs"
          className="join-item"
          onClick={() => blocker.proceed()}
          type="button"
        >
          Leave
        </Button>
        <Button
          c_size="xs"
          className="join-item"
          onClick={() => blocker.reset()}
          type="button"
        >
          Stay
        </Button>
      </div>
    </div>
  );
};
