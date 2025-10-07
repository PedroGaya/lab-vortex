import "./Auth.css";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../auth/AuthContext";

type RegisterSearchParams = {
  ref?: string;
};

const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("At least 8 characters");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("One lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("One uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("One number");
  }

  return errors;
};

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pwd: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const search = useSearch({ from: "/register" }) as RegisterSearchParams;
  const refCode = search.ref;

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate({ to: "/profile" });
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.pwd) {
      newErrors.pwd = "Password is required";
    } else {
      const passwordErrors = validatePassword(formData.pwd);
      if (passwordErrors.length > 0) {
        newErrors.pwd = `Password must contain: ${passwordErrors.join(", ")}`;
      }
    }

    if (formData.pwd !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;

      // Looks silly, but can be useful if you need to track ref clicks that didn't follow through.
      const registrationPayload = refCode
        ? { ...registerData, refCode }
        : { ...registerData };

      await register(registrationPayload);

      navigate({
        to: "/login",
        search: {
          registration: "success",
        },
      });
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          {refCode ? "You were referred here!" : "Join us and start referring!"}
        </p>

        {refCode && (
          <div className="referral-notice">
            <p>Hello from {refCode}!</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            placeholder="Choose a username"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
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
            placeholder="Create a password"
          />
          {errors.pwd && <span className="error-message">{errors.pwd}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link-button">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
