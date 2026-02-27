import React, { useMemo, useState } from "react";
import "./Login.css";
import loginImage from "../images/c1b9bf6e89bafae9e1c2257c6b8502d6.png"
import Swal from "sweetalert2";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("");

  const accessList = useMemo(
    () => [
      { key: "admin", label: "Admin Access", value: "lovelygarg607@gmail.com" },
      { key: "customer", label: "Customer Access", value: "customer@store.com" },
      { key: "delivery", label: "Delivery Access", value: "delivery@store.com" },
    ],
    []
  );

  const handleCopy = async (key, value) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1200);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiMessage("");
    setApiStatus("");

    if (!email.trim() || !password.trim()) {
      setApiMessage("Email and password are required");
      setApiStatus("error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/store/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (data?.status === "success" && data?.token) {
        localStorage.setItem("adminToken", data.token);
        setApiMessage(data.message || "Login successful");
        setApiStatus("success");
        await Swal.fire({
          icon: "success",
          title: "Admin login successfully",
          text: "Welcome back.",
          confirmButtonColor: "#5aaa44",
        });
        window.location.assign("/admin/dashboard");
      } else {
        setApiMessage(data?.message || "Invalid email or password");
        setApiStatus("error");
        await Swal.fire({
          icon: "error",
          title: "Invalid email or password",
          text: "Please check your credentials and try again.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      setApiMessage("Unable to connect to server");
      setApiStatus("error");
      console.error("Login failed", error);
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Unable to connect to server.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-visual">
          <img src={loginImage} alt="Login visual" />
        </div>

        <div className="login-panel">
          <div className="brand">
            <span className="brand-dot" />
            <span className="brand-text">Grostore</span>
          </div>

          <h2>Hey there!</h2>
          <p className="subtitle">Welcome back to Grostore.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="password-row">
              Password
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="ghost-btn icon-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="eye-icon" aria-hidden="true">
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </button>
              </div>
            </label>

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <button type="button" className="link-btn">
                Forgot Password
              </button>
            </div>

            <div className="quick-access">
              {accessList.map((item) => (
                <div className="qa-row" key={item.key}>
                  <span>{item.label}</span>
                  <button
                    type="button"
                    className="pill"
                    onClick={() => handleCopy(item.key, item.value)}
                  >
                    {copiedKey === item.key ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {apiMessage ? (
              <p className={`api-message ${apiStatus === "success" ? "success" : "error"}`}>
                {apiMessage}
              </p>
            ) : null}
          </form>

          <p className="footer-text">
            Don&apos;t have an Account? <button className="link-btn">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
