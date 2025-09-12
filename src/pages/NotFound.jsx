import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">404 — Sahifa topilmadi</h1>
        <p className="mb-4 opacity-70">Izlagan sahifangiz mavjud emas.</p>
        <Link to="/" className="btn btn-primary">Bosh sahifa</Link>
      </div>
    </div>
  );
}
