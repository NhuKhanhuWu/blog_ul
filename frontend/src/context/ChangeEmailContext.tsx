/** @format */

import { createContext, useContext, useState, ReactNode } from "react";

interface ChangeEmailContextType {
  isPasswordVerified: boolean;
  newEmail: string;
  password: string;
  setFields: (
    fields: Partial<{
      isPasswordVerified: boolean;
      newEmail: string;
      password: string;
    }>,
  ) => void;
  resetChangeEmailState: () => void;
}

const ChangeEmailContext = createContext<ChangeEmailContextType | undefined>(
  undefined,
);

export const ChangeEmailProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    isPasswordVerified: false,
    newEmail: "",
    password: "",
  });

  const setFields = (fields: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const resetChangeEmailState = () => {
    setState({ isPasswordVerified: false, newEmail: "", password: "" });
  };

  return (
    <ChangeEmailContext.Provider
      value={{
        ...state,
        setFields,
        resetChangeEmailState,
      }}>
      {children}
    </ChangeEmailContext.Provider>
  );
};

export const useChangeEmail = () => {
  const context = useContext(ChangeEmailContext);
  if (!context)
    throw new Error(
      "useChangeEmail must be used within useChangeEmail context",
    );
  return context;
};
