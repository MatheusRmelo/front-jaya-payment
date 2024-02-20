import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Root from './routes/root';
import Checkout from './views/checkout';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Checkout />,

  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root>
      <RouterProvider router={router} />
    </Root>
  </React.StrictMode>,
)
