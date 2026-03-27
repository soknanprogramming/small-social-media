import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import type { RootState } from "../app/store";
import { setLoggedIn } from "../features/auth/loginSlice";
import api from "../libs/axios";

const NavLink = ({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
    >
      {icon}
      {children}
    </Link>
  </li>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
  </svg>
);

const SideBar: React.FC = () => {
  const isLoggedIn = useAppSelector((state: RootState) => state.login.isLoggedIn);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    api
      .post("/api/users/logout")
      .then(() => dispatch(setLoggedIn(false)))
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-100 h-screen sticky left-0 top-0 flex flex-col px-3 py-5">
      {/* Logo / brand */}
      <div className="px-3 mb-6">
        <span className="text-base font-semibold text-gray-900">My App</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>
          {isLoggedIn && (
            <NavLink to="/profile" icon={<ProfileIcon />}>Profile</NavLink>
          )}
          {!isLoggedIn && (
            <>
              <NavLink to="/register" icon={<RegisterIcon />}>Register</NavLink>
              <NavLink to="/login" icon={<LoginIcon />}>Login</NavLink>
            </>
          )}
        </ul>
      </nav>

      {/* Logout at the bottom */}
      {isLoggedIn && (
        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default SideBar;