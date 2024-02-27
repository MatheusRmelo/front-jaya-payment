import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Checkout from './pages/Checkout/Checkout';
import './index.css';
import Payments from './pages/Payments/Payments';
import { useInternalRoutes } from './utils/hooks';
import Layout from './components/Layout/Layout';

const internalRoutes = useInternalRoutes();
const router = createBrowserRouter([
  {
    path: internalRoutes.payment,
    element: <Payments />,
  },
  {
    path: internalRoutes.checkout,
    element: <Checkout />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
)
