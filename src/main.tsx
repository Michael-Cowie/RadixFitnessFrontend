import './firebase.ts'; // Initializes Firebase
import './index.css'; // Initializes Tailwind CSS
import 'lib/colours.module.css'; // Access application colours
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import AppContextComponent from 'context/AppContext.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FoodIntakeTrackingPage from 'routes/FoodIntakeTrackingPage/FoodIntakeTrackingPage.tsx';
import HomePage from 'routes/HomePage.tsx';
import LoginPage from 'routes/LoginPage';
import ProtectedRoute from 'routes/ProtectedRoute';
import WeightTrackingPage from 'routes/WeightTrackingPage/WeightTrackingPage.tsx';

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
    },
    {
      path: "food_intake_tracking",
      element: <FoodIntakeTrackingPage/>
    }  
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextComponent>
      <RouterProvider router={ router } />
    </AppContextComponent>
  </React.StrictMode>
);
