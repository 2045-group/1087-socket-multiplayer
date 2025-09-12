import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Agar sizda auth selectorlar bo'lsa ulardan foydalaning:
const selectUser = (state) => state.auth?.user;
import { logoutThunk } from "./features/auth/authThunks";

export default function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b">
        <div className="container mx-auto px-4 flex gap-2">
          <Link to="/" className="btn btn-ghost text-xl">App</Link>

          <div className="ml-auto flex items-center gap-2">
            <Link to="/" className={`btn btn-ghost ${pathname === "/" ? "btn-active" : ""}`}>Home</Link>
            <Link to="/bubble" className={`btn btn-ghost ${pathname === "/bubble" ? "btn-active" : ""}`}>Bubble</Link>

            {!user ? (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            ) : (

              <button className="btn btn-outline" onClick={() => dispatch(logoutThunk())}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
