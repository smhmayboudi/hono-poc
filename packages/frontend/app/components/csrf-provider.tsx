import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from "react";

interface CSRFContextType {
  token: string;
}

interface CSRFProviderInputProps {
  name: string;
}

interface CSRFProviderProps {
  token: string;
}

const csrfContext = createContext<CSRFContextType | null>(null);

export const CSRFProvider: FC<PropsWithChildren<CSRFProviderProps>> = ({
  children,
  token,
}) => <csrfContext.Provider value={{ token }}>{children}</csrfContext.Provider>;

export const useCSRF = () => {
  const context = useContext(csrfContext);
  if (!context) {
    throw new Error("useCSRF must be used within a CSRFProvider");
  }

  return context;
};

export const CSRFInput = ({ name }: CSRFProviderInputProps) => {
  const csrf = useCSRF();

  return <input name={name} type="hidden" value={csrf.token} />;
};
