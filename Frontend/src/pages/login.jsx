import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "Unable to sign in. Please try again.";
  }
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (firebaseError) {
      setError(getAuthErrorMessage(firebaseError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            M
          </div>
          <div>
            <h2>MIFRA</h2>
            <span>ENTERPRISES</span>
          </div>
        </div>
        <div className="login-left-content">
          <span className="login-label">ADMIN PORTAL</span>
          <h1>
            Manage your business
            <br />
            <span>with confidence.</span>
          </h1>
          <p>
            Access your MIFRA Enterprises administration panel
            to manage products, services, customer requests
            and business operations.
          </p>
        </div>
        <div className="login-footer">
          © 2026 MIFRA Enterprises. All rights reserved.
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="mobile-login-brand">
            <div className="login-logo">
              M
            </div>
            <div>
              <h2>MIFRA</h2>
              <span>ENTERPRISES</span>
            </div>
          </div>
          <div className="login-header">
            <span>WELCOME BACK</span>
            <h2>Admin Login</h2>
            <p>
              Sign in to access your administration dashboard.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="login-input-group">
              <label htmlFor="admin-email">Email</label>
              <div className="login-input-wrapper">
                <FaUser className="login-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="login-input-group">
              <label htmlFor="admin-password">Password</label>
              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="login-security">
            <FaLock />
            <span>
              Secure administrator access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
