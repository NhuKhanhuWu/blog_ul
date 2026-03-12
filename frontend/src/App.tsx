/** @format */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { lazy } from "react";
import "./styles/general.scss";
import { store } from "./redux/store.ts";

// lazy load
const AppLayout = lazy(() => import("./layout/AppLayout.tsx"));
const Homepage = lazy(() => import("./page/Homepage"));
const BlogDetail = lazy(() => import("./page/BlogDetail.tsx"));
const Login = lazy(() => import("./page/Login.tsx"));
const Logout = lazy(() => import("./page/Logout.tsx"));

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
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
