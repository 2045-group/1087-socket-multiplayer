// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSelectors";


export default function RouterGuard({ redirectTo = "/login" }) {
    // const isAuthed = useSelector(selectIsAuthed);
    const isAuthed = true;
    return isAuthed ? <Outlet /> : <Navigate to={redirectTo} replace />;
}