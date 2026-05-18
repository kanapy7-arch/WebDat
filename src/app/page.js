"use client";

import { useState, useRef } from "react";
import data from "../utils/data.json";

export default function Page() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const searchRef = useRef(null);

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
  const [loggedInUser, setLoggedInUser] = useState(null);

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
    const isTeacher = loginTarget.type === "teacher";
    let emailMatch = false;
    if (isTeacher) {
      emailMatch = loginTarget.email
        ? loginEmail.trim().toLowerCase() === loginTarget.email.toLowerCase()
        : true;
    } else {
      emailMatch =
        loginEmail.trim().toLowerCase() === loginTarget.email.toLowerCase();
    }
    const passMatch = loginPassword === loginTarget.password;
    if (emailMatch && passMatch) {
      setLoginSuccess(true);
      setLoggedInUser(loginTarget);
      setLoginError("");
    } else if (!emailMatch) {
      setLoginError("Incorrect email.");
    } else {
      setLoginError("Incorrect password.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.firstname} ${user.lastname} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || user.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const students = filteredUsers.filter((u) => u.type === "student");
  const teachers = filteredUsers.filter((u) => u.type === "teacher");

  const jobColors = {
    developer: "bg-blue-100 text-blue-700",
    designer: "bg-purple-100 text-purple-700",
    manager: "bg-green-100 text-green-700",
    junior: "bg-yellow-100 text-yellow-700",
  };

  const filterTabs = [
    { key: "all", label: "All", count: filteredUsers.length },
    { key: "student", label: "Students", count: students.length },
    { key: "teacher", label: "Teachers", count: teachers.length },
  ];

  const Card = ({ user }) => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 p-5 pb-3">
        {user.image && (
          <img
            src={user.image}
            alt={`${user.firstname} profile`}
            className="w-14 h-14 rounded-full border-2 border-indigo-100 object-cover shadow-sm flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-800 truncate">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
              jobColors[user.job?.toLowerCase()] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {user.job}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 mx-5" />

      {user.items?.length > 0 && (
        <div className="px-5 pt-3 pb-2 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Items
          </p>
          <div className="flex flex-wrap gap-3">
            {user.items.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                title={`View ${item.name}`}
                className="group flex flex-col items-center gap-1 text-center hover:opacity-90 transition-opacity"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 group-hover:border-indigo-300 transition-colors shadow-sm"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/64x64?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow">
                    ↗
                  </span>
                </div>
                <span className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors max-w-[70px] leading-tight">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 px-5 pb-5 pt-3 mt-auto">
        <button
          onClick={() => openLogin(user)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2 rounded-xl text-sm font-medium transition-all"
        >
          Login
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="flex-1 bg-red-50 hover:bg-red-100 active:scale-95 text-red-500 hover:text-red-600 border border-red-200 py-2 rounded-xl text-sm font-medium transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-1">NHS Directory</h1>
        <p className="text-gray-400 text-sm">
          {users.filter((u) => u.type === "student").length} students ·{" "}
          {users.filter((u) => u.type === "teacher").length} teachers
        </p>
      </div>

      {/* Search Area */}
      <div className="flex flex-col items-center gap-4 mb-10">

        {/* Search input */}
        <div className="relative w-full max-w-lg">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </span>

          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-11 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 text-sm font-medium placeholder-gray-400 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
          />

          {search && (
            <button
              onClick={() => { setSearch(""); searchRef.current?.focus(); }}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter chips + result count */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                activeFilter === tab.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeFilter === tab.key
                    ? "bg-white/25 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}

          {search && (
            <span className="text-xs text-gray-400 ml-1">
              {filteredUsers.length === 0
                ? "No results"
                : `${filteredUsers.length} result${filteredUsers.length !== 1 ? "s" : ""}`}
            </span>
          )}
        </div>
      </div>

      {/* Students Section */}
      {(activeFilter === "all" || activeFilter === "student") && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Students</h2>
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-0.5 rounded-full">
              {students.length}
            </span>
          </div>
          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🎓</p>
              <p>No students found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {students.map((u) => (
                <Card key={u.id} user={u} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Teachers Section */}
      {(activeFilter === "all" || activeFilter === "teacher") && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-0.5 rounded-full">
              {teachers.length}
            </span>
          </div>
          {teachers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">👩‍🏫</p>
              <p>No teachers found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teachers.map((u) => (
                <Card key={u.id} user={u} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Login Modal */}
      {loginTarget && (
        <div
          onClick={closeLogin}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-7 rounded-2xl w-full max-w-sm shadow-2xl"
          >
            {loginTarget.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={loginTarget.image}
                  alt="profile"
                  className="w-20 h-20 rounded-full border-4 border-indigo-100 object-cover shadow"
                />
              </div>
            )}

            <h2 className="text-xl font-bold text-center text-gray-800 mb-0.5">
              {loginTarget.firstname} {loginTarget.lastname}
            </h2>
            <p className="text-sm text-center text-gray-400 mb-5">{loginTarget.job}</p>

            {loginSuccess ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-green-600 font-semibold text-lg mb-1">Login successful!</p>
                <p className="text-gray-400 text-sm mb-5">Welcome, {loginTarget.firstname}!</p>
                {loginTarget.items?.length > 0 && (
                  <div className="mb-5 text-left">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your items</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {loginTarget.items.map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                          className="group flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                          <img src={item.image} alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200 group-hover:border-indigo-300 transition-colors"
                            onError={(e) => { e.target.src = `https://placehold.co/64x64?text=${encodeURIComponent(item.name)}`; }}
                          />
                          <span className="text-xs text-gray-500 group-hover:text-indigo-600">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={closeLogin} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2.5 rounded-xl font-medium transition">
                  Close
                </button>
              </div>
            ) : (
              <>
                {loginTarget.type === "teacher" && !loginTarget.email?.includes("@") ? (
                  <p className="text-xs text-gray-400 text-center mb-3">Enter your password to log in.</p>
                ) : (
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border-2 border-gray-200 p-3 w-full rounded-xl mb-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-gray-900 placeholder-gray-400 transition-all"
                  />
                )}
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="border-2 border-gray-200 p-3 w-full rounded-xl mb-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-sm text-gray-900 placeholder-gray-400 transition-all"
                />
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-500 text-sm mb-3 px-3 py-2 rounded-lg text-center">
                    {loginError}
                  </div>
                )}
                <button
                  onClick={handleLogin}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white w-full py-2.5 rounded-xl font-medium transition-all"
                >
                  Login
                </button>
                <button
                  onClick={closeLogin}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
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