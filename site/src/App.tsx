import "./App.css";

import { Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app">
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
