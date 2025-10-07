import "./App.css";

import { Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./auth/AuthContext";

const queryClient = new QueryClient();

function Content() {
  const { isLoading } = useAuth();

  return (
    <div className="app">
      <div className="main-content">
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Content />
      </AuthProvider>
    </QueryClientProvider>
  );
}
