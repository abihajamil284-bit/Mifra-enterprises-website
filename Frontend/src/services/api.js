import { auth } from "../firebase";

const API_BASE_URL = "https://mifra-enterprises-website.vercel.app";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) throw new ApiError(401, "Your session has ended. Please sign in again.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`;
  let headers;
  try {
    headers = await getAuthHeaders();
  } catch (error) {
    if (import.meta.env.DEV) console.error("[MIFRA API] Authentication setup failed", error.message);
    throw error;
  }
  if (import.meta.env.DEV) console.info("[MIFRA API] GET", url);
  let response;
  try {
    response = await fetch(url, { headers });
  } catch (error) {
    if (import.meta.env.DEV) console.error("[MIFRA API] Network request failed", { url, message: error.message });
    throw new ApiError(0, "We could not reach the dashboard service. Please try again.");
  }
  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    data = body;
  }
  if (import.meta.env.DEV) console.info("[MIFRA API] Response", { url, status: response.status, body: data });
  if (!response.ok) {
    const message = response.status === 401
      ? "Your session could not be verified. Please sign in again."
      : response.status === 403
        ? "Your account does not have permission to access this dashboard."
        : "We could not load dashboard data. Please try again.";
    throw new ApiError(response.status, message);
  }
  return data;
}

export const getDashboard = () => apiGet("/api/admin/dashboard");
export const getAdminRequests = () => apiGet("/api/admin/requests");
