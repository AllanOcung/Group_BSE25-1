import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", roles: ["user","admin"] },
  { to: "/admin", label: "Admin", roles: ["admin"] },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const role = user?.role ?? "guest";

  return (
    <nav className="p-4 bg-slate-50 flex justify-between items-center">
      <div className="flex gap-3">
        <Link to="/" className="font-bold">My Portfolio</Link>
        {LINKS.filter(l => l.roles.includes(role)).map(l => (
          <Link key={l.to} to={l.to} className="ml-3">{l.label}</Link>
        ))}
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-3">Hi, {user.name}</span>
            <button onClick={logout} className="px-2 py-1 border rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-3">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}