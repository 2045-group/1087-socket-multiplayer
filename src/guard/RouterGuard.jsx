// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSelectors";
import { useEffect } from "react";


export default function RouterGuard({ children }) {
    const isAuthed = useSelector(selectIsAuthed);
    const redirectTo = "/login";
    const navigate = useNavigate();
    useEffect(() => {
        console.log(isAuthed);

        if (isAuthed) {
            console.log("authed");
            navigate("/", { replace: true });
        } else {
            console.log("not authed");
            navigate("/login", { replace: true });
        }
    }, [isAuthed]);

    return isAuthed ? children : <Navigate to={redirectTo} replace />;
}