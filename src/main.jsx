import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ErrorPage from './pages/ErrorPage.jsx';
import App from './App.jsx';

// Lazily load pages for Suspense
const AppLayout = lazy(() => import('./App.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Bubble = lazy(() => import('./pages/Bubble.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ProtectedRoute = lazy(() => import('./guard/RouterGuard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const LoadingScreen = lazy(() => import('./pages/LoadingScreen.jsx'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Bubble />
    ),
    errorElement: <ErrorPage />,   // 👈 qo‘shildi
    children: [
      // PRIVATE routes
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bubble",
        element: (
          <ProtectedRoute>
            <Bubble />
          </ProtectedRoute>
        ),
      },

      // PUBLIC routes

    ],
  },

  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "*", element: <NotFound /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={
          <div className="min-h-screen grid place-items-center bg-base-200">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
