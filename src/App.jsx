// src/App.jsx
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutThunk } from "./features/auth/authThunks"; // вверх

// вынести селектор в отдельный файл / модуль было бы лучше, но пока так:
const selectUser = (state) => state.auth?.user;

export default function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // если logoutThunk возвращает промис — можно await/then, но здесь просто диспатчим
    dispatch(logoutThunk());
  };

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 border-b">
        <div className="container mx-auto px-4 flex items-center gap-2">
          <Link to="/" className="btn btn-ghost text-xl">App</Link>

          <nav className="ml-auto flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `btn btn-ghost ${isActive ? "btn-active" : ""}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/bubble"
              className={({ isActive }) => `btn btn-ghost ${isActive ? "btn-active" : ""}`}
            >
              Bubble
            </NavLink>

            {!user ? (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            ) : (
              <>
                <span className="px-2 hidden sm:inline">Hi, {user.name || user.email}</span>
                <button
                  className="btn btn-outline"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
