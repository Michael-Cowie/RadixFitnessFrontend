import "./firebase.ts"; // Initializes Firebase
import "./index.css";   // Initializes Tailwind CSS

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reset } from "styled-reset";


import { AuthProvider }  from "context/AuthContext";
import Home from "routes/Home";
import LoginPage from "routes/LoginPage";
import ProtectedRoute from "routes/ProtectedRoute";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    element: <ProtectedRoute/>,
    children: [
    {
      path: "/",
      element: <Home/>,
  }]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Reset/>
    <AuthProvider>
      <RouterProvider router={ router } />
    </AuthProvider>
  </React.StrictMode>
);
