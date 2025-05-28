import { useCallback, useEffect, useRef, useState } from "react";
import { Blocker, useBlocker, useFetcher } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";

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
      <Icon
        name="outline-warning"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      />
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
