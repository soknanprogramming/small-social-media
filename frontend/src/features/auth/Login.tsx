import { useLogin } from "./hooks/useLogin";
import { EmailIcon } from "../../components/icons/EmailIcon";
import { LockIcon } from "../../components/icons/LockIcon";
import { EyeIcon } from "../../components/icons/EyeIcon";
import { LoginIcon } from "../../components/icons/LoginIcon";
import { RegisterIcon } from "../../components/icons/RegisterIcon";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { type RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const {
    formData,
    loading,
    apiError,
    successMessage,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword,
  } = useLogin();
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.login.isLoggedIn,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-8 py-8">
          {/* Header — mirrors sidebar brand style */}
          <div className="mb-7">
            <span className="text-base font-semibold text-gray-900">
              Small Social
            </span>
            <h1 className="text-sm text-gray-500 mt-0.5">
              Sign in to your account
            </h1>
          </div>

          {/* Alerts */}
          {apiError && (
            <div className="mb-5 flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              {apiError}
            </div>
          )}
          {successMessage && (
            <div className="mb-5 flex items-start gap-2.5 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit — mirrors sidebar logout button style but primary */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2.5 w-full px-4 py-2 mt-1 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  <LoginIcon />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register link — matches sidebar nav link style */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="inline-flex items-center gap-1 font-medium text-gray-900 hover:underline transition-colors"
          >
            <RegisterIcon />
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
