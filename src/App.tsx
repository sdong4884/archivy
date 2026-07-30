import { lazy, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/authStore";

const Search = lazy(() =>
  import("./pages/Search").then((m) => ({ default: m.Search })),
);
const MovieDetail = lazy(() =>
  import("./pages/MovieDetail").then((m) => ({ default: m.MovieDetail })),
);
const MovieModify = lazy(() =>
  import("./pages/MovieModify").then((m) => ({ default: m.MovieModify })),
);
const Wishlist = lazy(() =>
  import("./pages/Wishlist").then((m) => ({ default: m.Wishlist })),
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "/movie/:id/modify",
        element: <MovieModify />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useAuthStore.getState().setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
