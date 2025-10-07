import "./Auth.css";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../auth/AuthContext";

type LoginSearchParams = {
  registration?: string;
};

export function Login() {
  const [formData, setFormData] = useState({
    identifier: "",
    pwd: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const search = useSearch({ from: "/login" }) as LoginSearchParams;
  const registered = search.registration == "success";

  if (authLoading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate({ to: "/profile" });
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }

    if (!formData.pwd) {
      newErrors.pwd = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      // Navigation will happen automatically due to the useEffect
    } catch (error) {
      setErrors({ submit: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Don't render the form if user is logged in (will redirect)
  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Redirecting...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Please sign in to your account</p>

        {registered && (
          <div className="referral-notice">
            <p>You have successfuly signed up!</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="identifier">Username or Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            className={errors.identifier ? "error" : ""}
            placeholder="Enter your username or email"
          />
          {errors.identifier && (
            <span className="error-message">{errors.identifier}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="pwd">Password</label>
          <input
            type="password"
            id="pwd"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
            className={errors.pwd ? "error" : ""}
            placeholder="Enter your password"
          />
          {errors.pwd && <span className="error-message">{errors.pwd}</span>}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="auth-link-button"
              search={{ ref: undefined }}
            >
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
