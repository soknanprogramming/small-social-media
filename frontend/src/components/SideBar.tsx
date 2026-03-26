import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const SideBar: React.FC = () => {
  const token = useAppSelector((state) => state.jwt.token);

  return (
    <div className="w-30 bg-amber-200 h-screen sticky left-0 top-0 mr-2 p-2">
      <nav>
        <ul>
          <li className="hover:text-blue-600">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-600">
            <Link to="/about">About</Link>
          </li>
            {!token ? (
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
                    <Link to="/logout">Logout</Link>
                </li>
            )}

        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
