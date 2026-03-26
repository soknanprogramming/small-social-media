import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { deleteToken } from "../features/auth/jwtSlice";
import type { RootState } from "../app/store";

const SideBar: React.FC = () => {
  // const token = useAppSelector((state: RootState) => state.jwt.token);
  const isLoggedIn = useAppSelector((state: RootState) => state.login.isLoggedIn);
  const dispatch = useAppDispatch();

  console.log("Sidebar - isLoggedIn:", isLoggedIn);

  return (
    <div className="w-30 bg-amber-200 h-screen sticky left-0 top-0 mr-2 p-2">
      <nav>
        <ul>
            {
                isLoggedIn && (
                    <li className="hover:text-blue-600">
                        <Link to="/profile">Profile</Link>
                    </li>
                )
            }
          <li className="hover:text-blue-600">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-600">
            <Link to="/about">About</Link>
          </li>
            {!isLoggedIn ? (
              <>
                <li className="hover:text-blue-600">
                  <Link to="/register">Register</Link>
                </li>
                <li className="hover:text-blue-600">
                  <Link to="/login">Login</Link>
                </li>
              </>
            ) : (
                <li className="hover:text-blue-600">
                    <button onClick={() => dispatch(deleteToken())}>Logout</button>
                </li>
            )}

        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
