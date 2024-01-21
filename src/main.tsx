import "./firebase.ts"; // Initializes Firebase
import "./index.css";   // Initializes Tailwind CSS

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Reset } from "styled-reset";

import { AuthProvider }  from "context/AuthContext";
import HomePage from "routes/HomePage.tsx";
import LoginPage from "routes/LoginPage";
import ProtectedRoute from "routes/ProtectedRoute";
import WeightTrackingPage from "routes/WeightTrackingPage.tsx";


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
      element: <HomePage/>,
    },
    {
      path: "weight_tracking",
      element: <WeightTrackingPage/>
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
