// src/pages/Dashboard.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../features/auth/authThunks";
import { selectUser } from "../features/auth/authSelectors";


export default function Profile() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);


    return (
        <div className="container-max py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Xush kelibsiz, {user?.username || user?.email || "Foydalanuvchi"}</h1>
                <button className="btn btn-outline" onClick={() => dispatch(logoutThunk())}>Logout</button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h3 className="card-title">Profil</h3>
                        <p>Email: {user?.email || "-"}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h3 className="card-title">Holat</h3>
                        <p>Shaxsiy kabinetingizga xush kelibsiz.</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h3 className="card-title">Tezkor amallar</h3>
                        <button className="btn btn-primary">Action</button>
                    </div>
                </div>
            </div>
        </div>
    );
}