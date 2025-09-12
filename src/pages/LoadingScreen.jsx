import React from "react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen grid place-items-center bg-base-200">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="opacity-70">Yuklanmoqda...</p>
      </div>
    </div>
  );
}
