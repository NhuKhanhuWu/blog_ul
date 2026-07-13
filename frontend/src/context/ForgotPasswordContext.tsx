/** @format */
/** @format */

import { createContext, useContext, useState, ReactNode } from "react";

interface ForgotPasswordContextType {
  email: string;
  isOtpVerified: boolean;
  token: string;
  setFields: (
    fields: Partial<{
      email: string;
      isOtpVerified: boolean;
      token: string;
    }>,
  ) => void;
  resetSignupState: () => void;
}

const ForgotPasswordContext = createContext<
  ForgotPasswordContextType | undefined
>(undefined);

export const ForgotPasswordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState({
    email: "",
    isOtpVerified: false,
    token: "",
  });

  const setFields = (fields: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const resetForgotPasswordState = () => {
    setState({ email: "", isOtpVerified: false, token: "" });
  };

  return (
    <ForgotPasswordContext.Provider
      value={{
        ...state,
        setFields,
        resetSignupState: resetForgotPasswordState,
      }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(ForgotPasswordContext);
  if (!context)
    throw new Error("useForgotPassword must be used within useForgotPassword");
  return context;
};
