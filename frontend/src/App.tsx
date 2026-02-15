/** @format */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { lazy } from "react";
import "./styles/general.scss";

// lazy load
const AppLayout = lazy(() => import("./layout/AppLayout.tsx"));
const Homepage = lazy(() => import("./page/Homepage"));

const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [{ element: <Homepage />, path: "/" }],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
