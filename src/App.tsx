import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { MovieDetail } from "./pages/MovieDetail";
import { MovieModify } from "./pages/MovieModify";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/authStore";

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
    ],
  },
]);

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useAuthStore.getState().setUser(user);
    });
    return unsubscribe;
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
