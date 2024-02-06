import './firebase.ts'; // Initializes Firebase
import './index.css'; // Initializes Tailwind CSS

import AppContextComponent from 'context/AppContext.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from 'routes/HomePage.tsx';
import LoginPage from 'routes/LoginPage';
import ProtectedRoute from 'routes/ProtectedRoute';
import WeightTrackingPage from 'routes/WeightTrackingPage.tsx';
import { Reset } from 'styled-reset';

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
    <AppContextComponent>
      <RouterProvider router={ router } />
    </AppContextComponent>
  </React.StrictMode>
);
