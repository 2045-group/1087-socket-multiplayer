import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const message = (error?.statusText || error?.message || "Kutilmagan xato!");

    return (
        <div className="min-h-screen grid place-items-center bg-base-200 p-6">
            <div className="card bg-base-100 shadow-xl w-full max-w-lg">
                <div className="card-body">
                    <h2 className="card-title text-2xl">Unexpected Application Error</h2>
                    <div className="alert alert-error mt-3">
                        <span>{String(message)}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="btn btn-outline" onClick={() => window.location.reload()}>
                            Reload
                        </button>
                        <Link className="btn btn-primary" to="/">Bosh sahifa</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
