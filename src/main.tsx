import './firebase.ts'; // Initializes Firebase
import './index.css'; // Initializes Tailwind CSS
import 'lib/colours.module.css'; // Access application colours
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FoodIntakeTrackingPage from 'routes/FoodIntakeTrackingPage/FoodIntakeTrackingPage.tsx';
import HomePage from 'routes/HomePage.tsx';
import LoginPage from 'routes/LoginPage/LoginPage.tsx';
import ProtectedRoute from 'routes/ProtectedRoute';
import WeightTrackingPage from 'routes/WeightTrackingPage/WeightTrackingPage.tsx';
import AccountPrerequisites from 'routes/AccountPrerequisites.tsx';
import RootLayout from 'routes/RootLayout.tsx';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AccountPrerequisites />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "weight_tracking", element: <WeightTrackingPage /> },
              { path: "food_intake_tracking", element: <FoodIntakeTrackingPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
