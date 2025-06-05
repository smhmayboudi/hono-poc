import { useCallback, useEffect, useRef, useState } from "react";
import { type Blocker, useBlocker, useFetcher } from "react-router";

import Button from "~/components/ui/button";
import Icon from "~/components/ui/icon";

interface FormBlockerProps {
  blocker: Blocker;
}

export const useFormBlocker = (fetcher: ReturnType<typeof useFetcher>) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
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
      <Icon c_name="outline-warning" />
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
