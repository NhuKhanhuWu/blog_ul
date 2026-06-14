/** @format */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { lazy } from "react";
import toast, { Toaster } from "react-hot-toast";
import { store } from "./redux/store.ts";
import axios from "axios";

// lazy load
const AppLayout = lazy(() => import("./layout/AppLayout.tsx"));
const Homepage = lazy(() => import("./page/Homepage/Homepage.tsx"));
const BlogDetail = lazy(() => import("./page/BlogDetail/BlogDetail.tsx"));
const Login = lazy(() => import("./page/Login/Login.tsx"));
const Logout = lazy(() => import("./page/Logout/Logout.tsx"));

const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      { element: <Homepage />, path: "/" },
      { element: <BlogDetail />, path: "/blog/:slug" },
      { element: <Login />, path: "/auth/login" },
      { element: <Logout />, path: "user/logout" },
    ],
  },
]);

const queryClient = new QueryClient({
  // cache for 60s
  defaultOptions: { queries: { staleTime: 60 * 1000 } },

  // show error message on toast
  mutationCache: new MutationCache({
    onError: (error) => {
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

        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
