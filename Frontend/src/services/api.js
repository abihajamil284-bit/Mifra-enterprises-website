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
  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    throw new ApiError(401, "Your session could not be verified. Please sign in again.");
  }
}

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`;
  let headers;
  try {
    headers = await getAuthHeaders();
  } catch (error) {
    throw error;
  }
  let response;
  try {
    response = await fetch(url, { headers });
  } catch {
    throw new ApiError(0, "We could not reach the dashboard service. Please try again.");
  }
  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : null;
  } catch {
    data = body;
  }
  if (!response.ok) {
    const detail = data && typeof data === "object" ? data.detail : "";
    const message = response.status === 401
      ? "Your session could not be verified. Please sign in again."
      : response.status === 403
        ? "Your account does not have permission to access this dashboard."
        : response.status >= 500
          ? "The dashboard service is temporarily unavailable. Please try again."
          : typeof detail === "string" && detail
            ? detail
            : "We could not load dashboard data. Please try again.";
    throw new ApiError(response.status, message);
  }
  return data;
}

export const getDashboard = () => apiGet("/api/admin/dashboard");
export const getAdminRequests = () => apiGet("/api/admin/requests");
