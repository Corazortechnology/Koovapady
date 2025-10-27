import React, { useState } from "react";

export default function PasswordPage({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Access Vite env variable
  const sitePassword = import.meta.env.VITE_SITE_PASSWORD ?? "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === sitePassword) {
      sessionStorage.setItem("authenticated", "true");
      setError("");
      onSuccess();
    } else {
      setError("Incorrect password — try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col space-y-5 border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Enter Access Password
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
          autoFocus
        />

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 py-1 rounded-md">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
