/** @format */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import { store } from "./redux/store.ts";
import axios from "axios";
import { StyledEngineProvider } from "@mui/material/styles";
import Loader from "./component/ui/Loader/Loader.tsx";

// lazy load
const AppLayout = lazy(() => import("./layout/AppLayout.tsx"));
const AuthFormLayout = lazy(
  () => import("./layout/AuthFormLayout/AuthFormLayout.tsx"),
);
const Homepage = lazy(() => import("./page/Homepage/Homepage.tsx"));
const Me = lazy(() => import("./page/Me/Me.tsx"));

const BlogDetail = lazy(() => import("./page/BlogDetail/BlogDetail.tsx"));
const BlogListDetail = lazy(
  () => import("./page/BlogListDetail/BlogListDetail.tsx"),
);

const Login = lazy(() => import("./page/Login/Login.tsx"));
const Logout = lazy(() => import("./page/Logout/Logout.tsx"));

const SignUpGuardLayout = lazy(() => import("./layout/SignUpGuardLayout.tsx"));
const SignUpEmail = lazy(() => import("./page/SignUpEmail/SignUpEmai.tsx"));
const SignUpOtp = lazy(() => import("./page/SignUpOtp/SignUpOtp.tsx"));
const SignUpPassword = lazy(() => import("./page/SignUpSetUp/SignUpSetUp.tsx"));

const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      { element: <Homepage />, path: "/" },
      { element: <BlogDetail />, path: "/blog/:slug" },

      {
        path: "/auth",
        element: <AuthFormLayout />,
        children: [
          // sign up
          {
            path: "signup",
            element: <SignUpGuardLayout />,
            children: [
              { index: true, element: <SignUpEmail /> }, // URL: /auth/signup
              { path: "verify-otp", element: <SignUpOtp /> }, // URL: /auth/signup/verify-otp
              { path: "setup-password", element: <SignUpPassword /> }, // URL: /auth/signup/setup-password
            ],
          },

          { element: <Login />, path: "login" },
          { element: <Logout />, path: "logout" },
        ],
      },
      { element: <Me />, path: "/user/me" },
      { element: <BlogListDetail />, path: "/list/:id" },
    ],
  },
]);

const queryClient = new QueryClient({
  // cache for 60s, increase for less frequent updates
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // Cancel requests after 30s to prevent slow network from blocking other requests
      networkMode: "always",
      retry: 1, // Only retry once on failure
      refetchOnWindowFocus: false,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      networkMode: "always",
    },
  },

  // show error message on toast
  queryCache: new QueryCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || error.message;
        toast.error(serverMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // check if this mutation required toast turn off
      if (mutation.meta?.disableToast) {
        return;
      }

      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || error.message;
        toast.error(serverMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  }),
});

function App() {
  const isDev = import.meta.env.VITE_NODE_ENV === "development";

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}

          <Toaster
            position="bottom-left"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                background: "var(--bg-body)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                zIndex: 9999,
              },
            }}
          />

          <Suspense fallback={<Loader />}>
            <RouterProvider router={router}></RouterProvider>
          </Suspense>
        </StyledEngineProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
