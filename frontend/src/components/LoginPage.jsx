import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center p-4 relative z-10">
        {/* Left logo section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <XSvg className="w-3/4 max-w-md fill-white" />
        </div>

        {/* Right form section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md backdrop-blur-sm bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
              <div className="flex justify-center mb-2">
                <XSvg className="w-16 h-16 sm:w-20 sm:h-20 lg:hidden fill-white" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Let's go.
              </h1>

              <div className="w-full space-y-4">
                <label className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <MdOutlineMail className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Username</span>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter your username"
                    name="username"
                    onChange={handleInputChange}
                    value={formData.username}
                    required
                  />
                </label>

                <label className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <MdPassword className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Password</span>
                  </div>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    required
                  />
                </label>
              </div>

              <button
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              {error && (
                <p className="text-red-400 text-sm text-center mt-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}
            </form>

            <div className="w-full mt-8 flex flex-col items-center gap-4">
              <p className="text-gray-400 text-base text-center">
                Don&apos;t have an account?
              </p>
              <Link to="/signup" className="w-full">
                <button className="w-full px-6 py-3 rounded-xl bg-transparent text-white font-semibold border-2 border-blue-500 hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all transform hover:scale-[1.02]">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
