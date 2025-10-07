import "./Profile.css";

import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";

export function Profile() {
  const { user, logout, deleteAccount } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  // Real-time referral count updates
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return user;
    },
    refetchInterval: 5000,
    enabled: !!user,
  });

  const referralLink = user
    ? `${window.location.origin}/register?ref=${user.refCode}`
    : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Navigation will happen automatically due to the useEffect
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setShowDeleteConfirm(false);
    // Navigation will happen automatically due to the useEffect
  };

  // Show loading or redirect if no user
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Redirecting...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Your Profile</h2>
          <p className="welcome-message">Welcome back, {userData?.name}!</p>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Username:</label>
            <span>{userData?.name}</span>
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{userData?.email}</span>
          </div>

          <div className="info-item">
            <label>Referral Count:</label>
            <span className="referral-count">{userData?.refCount || 0}</span>
          </div>
        </div>

        <div className="referral-section">
          <h3>Your Referral Link</h3>
          <div className="referral-link-container">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="referral-link-input"
            />
            <button
              onClick={copyToClipboard}
              className={`copy-button ${copySuccess ? "success" : ""}`}
            >
              {copySuccess ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="referral-help">
            Share this link with friends! You'll get a BIGGER NUMBER when they
            sign up.
          </p>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-button"
          >
            Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirm-modal">
            <div className="delete-confirm-content">
              <h3>Delete Account</h3>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="delete-confirm-actions">
                <button
                  onClick={handleDeleteAccount}
                  className="delete-confirm-button"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="delete-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
