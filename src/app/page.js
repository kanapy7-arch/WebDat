"use client";

import { useState } from "react";
import data from "../utils/data.json";

export default function Page() {
  const [search, setSearch] = useState("");

  const allUsers = [
    ...data.students.map((u) => ({ ...u, type: "student" })),
    ...data.teachers.map((u) => ({
      ...u,
      type: "teacher",
      firstname: u.name,
      lastname: "",
      job: u.role,
      email: u.email || "no-email",
    })),
  ];

  const [users, setUsers] = useState(allUsers);
  const [loginTarget, setLoginTarget] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const openLogin = (user) => {
    setLoginTarget(user);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setLoginSuccess(false);
  };

  const closeLogin = () => {
    setLoginTarget(null);
    setLoginError("");
    setLoginSuccess(false);
  };

  const handleLogin = () => {
    if (!loginTarget) return;
    const emailMatch = loginEmail.trim().toLowerCase() === loginTarget.email.toLowerCase();
    const passMatch = loginPassword === loginTarget.password;

    if (emailMatch && passMatch) {
      setLoginSuccess(true);
      setLoginError("");
    } else if (!emailMatch) {
      setLoginError("Incorrect email.");
    } else {
      setLoginError("Incorrect password.");
    }
  };

  // Live search filter
  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const students = filteredUsers.filter((u) => u.type === "student");
  const teachers = filteredUsers.filter((u) => u.type === "teacher");

  const Card = ({ user }) => (
    <div className="bg-white border rounded-2xl shadow-sm hover:shadow-xl transition flex flex-col overflow-hidden">
      {/* Top: info */}
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-indigo-600">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 mt-1 shrink-0">
            {user.job}
          </span>
        </div>

        {/* Items list */}
        {user.items?.length > 0 && (
          <div className="mt-2 space-y-2">
            {user.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-md object-cover border"
                  />
                )}
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile image at bottom */}
      {user.image && (
        <div className="flex justify-center px-5 pb-2">
          <img
            src={user.image}
            alt={`${user.firstname} profile`}
            className="w-20 h-20 rounded-full border-4 border-indigo-100 object-cover shadow"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 px-5 pb-5 pt-2">
        <button
          onClick={() => openLogin(user)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          Login
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="flex justify-center gap-2 mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 w-full max-w-md rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Students */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Students
        <span className="ml-2 text-lg font-normal text-gray-400">({students.length})</span>
      </h1>
      {students.length === 0 ? (
        <p className="text-center text-gray-400 mb-10">No students found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {students.map((u) => (
            <Card key={u.id} user={u} />
          ))}
        </div>
      )}

      {/* Teachers */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Teachers
        <span className="ml-2 text-lg font-normal text-gray-400">({teachers.length})</span>
      </h1>
      {teachers.length === 0 ? (
        <p className="text-center text-gray-400 mb-10">No teachers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((u) => (
            <Card key={u.id} user={u} />
          ))}
        </div>
      )}

      {/* Login Modal */}
      {loginTarget && (
        <div
          onClick={closeLogin}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-7 rounded-2xl w-full max-w-sm shadow-2xl"
          >
            {/* Avatar in modal */}
            {loginTarget.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={loginTarget.image}
                  alt="profile"
                  className="w-16 h-16 rounded-full border-4 border-indigo-100 object-cover"
                />
              </div>
            )}

            <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
              {loginTarget.firstname} {loginTarget.lastname}
            </h2>
            <p className="text-sm text-center text-gray-400 mb-5">{loginTarget.job}</p>

            {loginSuccess ? (
              <div className="text-center">
                <p className="text-green-600 font-semibold text-lg mb-4">✅ Login successful!</p>
                <button
                  onClick={closeLogin}
                  className="bg-indigo-600 text-white w-full py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="border p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="border p-3 w-full rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                {loginError && (
                  <p className="text-red-500 text-sm mb-3 text-center">{loginError}</p>
                )}

                <button
                  onClick={handleLogin}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg font-medium transition"
                >
                  Login
                </button>

                <button
                  onClick={closeLogin}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}