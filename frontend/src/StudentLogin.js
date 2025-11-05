import React, { useState } from "react";

const StudentLogin = ({ onLogin }) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!studentId.trim() || !password.trim()) {
      setError("Please enter both Student ID and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.student);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl shadow-md rounded-2xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Student Portal
          </h1>
          <p className="text-gray-500 text-sm">
            Access your student support dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g., STU001"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm border border-red-200">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium text-base transition-all 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
              }`}
          >
            {loading ? "🔄 Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-gray-600 text-sm bg-gray-50 border border-gray-100 rounded-lg p-4">
          <strong className="text-gray-800 block mb-2">📋 Demo Accounts</strong>
          <ul className="space-y-1">
            <li>👤 STU001 / student123</li>
            <li>👤 STU002 / student123</li>
            <li>👤 STU003 / student123</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-blue-600 transition font-medium"
          >
            🔧 Admin Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
