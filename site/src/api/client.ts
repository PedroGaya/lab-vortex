const API_BASE = "http://localhost:4000";

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "API error" }));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export const api = {
  register: (data: any) => {
    const { refCode, ...registerData } = data;
    const url = refCode
      ? `/user/register?ref=${encodeURIComponent(refCode)}`
      : "/user/register";
    return apiCall(url, {
      method: "POST",
      body: JSON.stringify({ ...registerData, referred: refCode != null }),
    });
  },
  login: (data: any) =>
    apiCall("/user/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => apiCall("/user/logout", { method: "POST" }),
  deleteAccount: () => apiCall("/user/delete", { method: "DELETE" }),
};
