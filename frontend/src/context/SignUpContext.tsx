/** @format */

import { createContext, useContext, useState, ReactNode } from "react";

interface SignUpContextType {
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

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({
    email: "",
    isOtpVerified: false,
    token: "",
  });

  const setFields = (fields: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const resetSignupState = () => {
    setState({ email: "", isOtpVerified: false, token: "" });
  };

  return (
    <SignUpContext.Provider value={{ ...state, setFields, resetSignupState }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context)
    throw new Error("useSignUpData must be used within SignUpProvider");
  return context;
};
