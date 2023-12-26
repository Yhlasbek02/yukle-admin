import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register"
import Main from './Components/Main/Main';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <Main />
  },
])


function App() {

  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>

  );
}

export default App;
