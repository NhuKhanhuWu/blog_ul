/** @format */

import { createContext, useContext, useState, ReactNode } from "react";

interface SignUpContextType {
  email: string;
  setEmail: (email: string) => void;
}

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  return (
    <SignUpContext.Provider value={{ email, setEmail }}>
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
