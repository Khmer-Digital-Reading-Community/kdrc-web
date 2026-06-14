import axios from "axios";
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackBaseUrl = "http://localhost:3000";

if (!rawBaseUrl) {
  console.warn(
    `VITE_API_BASE_URL is not set. Falling back to ${fallbackBaseUrl}. ` +
    "Create a .env file in kdrc-web to override this.",
  );
}

export const apiBaseUrl = (rawBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
});

// Unwrap the global { status, data } envelope added by the NestJS ResponseInterceptor.
// Without this, response.data would be { status: 'success', data: actualPayload }
// instead of actualPayload, breaking every caller that does `return response.data`.
api.interceptors.response.use((response) => {
  if (
    response.data &&
    typeof response.data === "object" &&
    "status" in response.data &&
    "data" in response.data
  ) {
    response.data = response.data.data;
  }
  return response;
});

export const setApiAuthToken = (accessToken: string | null) => {
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return;
  }

  delete api.defaults.headers.common["Authorization"];
};

export default api;
