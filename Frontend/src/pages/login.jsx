import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    if (username === "admin" && password === "admin123") {
      navigate("/admin");
    } else {
      setError("Incorrect username or password.");
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
              <label>Username</label>
              <div className="login-input-wrapper">
                <FaUser className="login-input-icon" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>
            <div className="login-input-group">
              <label>Password</label>
              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />
                <input
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
            >
              Sign In
            </button>
          </form>
          <div className="login-security">
            <FaLock />
            <span>
              Secure administrator access
            </span>
          </div>
          <div className="login-demo">
            <span>Demo Credentials</span>
            <p>
              Username: <strong>admin</strong>
            </p>
            <p>
              Password: <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;