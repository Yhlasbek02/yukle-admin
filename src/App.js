import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login/Login";
import Main from './Components/Main/Main';
import ForgotPassword from './Components/forgotPassword/forgotPassword';
import Verify from './Components/verify/verify';
import ChangePassword from './Components/changePassword/changePassword';
import 'font-awesome/css/font-awesome.min.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify',
    element: <Verify />
  },
  {
    path: '/change-password',
    element: <ChangePassword />
  },
  {
    path: '/',
    element: <Main />
  },
])


function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>

  );
}

export default App;
