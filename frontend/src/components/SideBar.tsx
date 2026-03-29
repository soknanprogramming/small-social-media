import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import type { RootState } from "../app/store";
import { setLoggedIn } from "../features/auth/loginSlice";
import api from "../libs/axios";
import { HomeIcon } from "./icons/HomeIcon";
import { MyPostsIcon } from "./icons/MyPostsIcon";
import { PostsIcon } from "./icons/PostsIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { RegisterIcon } from "./icons/RegisterIcon";
import { LoginIcon } from "./icons/LoginIcon";
import { LogoutIcon } from "./icons/LogoutIcon";

const NavLink = ({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        {icon}
        {children}
      </Link>
    </li>
  );
};

const SideBar: React.FC = () => {
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.login.isLoggedIn,
  );
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
        <span className="text-base font-semibold text-gray-900">
          Small Social
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          <NavLink to="/" icon={<HomeIcon />}>
            Home
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink to="/posts" icon={<PostsIcon />}>
                Posts
              </NavLink>
              <NavLink to="/my_posts" icon={<MyPostsIcon />}>
                My Posts
              </NavLink>
              <NavLink to="/profile" icon={<ProfileIcon />}>
                Profile
              </NavLink>
            </>
          )}
          {!isLoggedIn && (
            <>
              <NavLink to="/register" icon={<RegisterIcon />}>
                Register
              </NavLink>
              <NavLink to="/login" icon={<LoginIcon />}>
                Login
              </NavLink>
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
