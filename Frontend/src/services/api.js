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
  const headers = await getAuthHeaders();
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

async function apiRequest(path, method, body) {
  const headers = await getAuthHeaders();
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, "We could not reach the dashboard service. Please try again.");
  }
  const responseBody = await response.text();
  let data;
  try { data = responseBody ? JSON.parse(responseBody) : null; } catch { data = responseBody; }
  if (!response.ok) {
    const detail = data && typeof data === "object" ? data.detail : "";
    const message = response.status === 401 ? "Your session could not be verified. Please sign in again." : response.status === 403 ? "Your account does not have permission to access this dashboard." : response.status === 404 ? "The product endpoint was not found on the deployed backend. No product was created." : response.status >= 500 ? "The dashboard service is temporarily unavailable. Please try again." : typeof detail === "string" && detail ? detail : "We could not save dashboard data. Please try again.";
    throw new ApiError(response.status, message);
  }
  return data;
}

export const getDashboard = () => apiGet("/api/admin/dashboard");
export const getAdminRequests = () => apiGet("/api/admin/requests");
export const updateAdminRequest = (requestId, data) => apiRequest(`/api/admin/requests/${requestId}`, "PUT", data);
export const getAdminMessages = () => apiGet("/api/admin/messages");
export const updateAdminMessage = (messageId, data) => apiRequest(`/api/admin/messages/${messageId}`, "PUT", data);
export const getAdminProducts = () => apiGet("/api/admin/products");
export const getProducts = () => apiGet("/api/products/");
export const getProduct = (productId) => apiGet(`/api/products/${productId}`);
export const getServices = () => apiGet("/api/services/");
export const getService = (serviceId) => apiGet(`/api/services/${serviceId}`);
export const getCategories = () => apiGet("/api/categories/");
export const getSiteSettings = () => apiGet("/api/site-settings/");
export const updateAdminSettings = (settings) => apiRequest("/api/admin/settings", "PUT", settings);
export const createAdminService = (service) => apiRequest("/api/admin/services", "POST", service);
export const updateAdminService = (serviceId, service) => apiRequest(`/api/admin/services/${serviceId}`, "PUT", service);
export const deleteAdminService = (serviceId) => apiRequest(`/api/admin/services/${serviceId}`, "DELETE");
export const createAdminProduct = (product) => apiRequest("/api/admin/products", "POST", product);
export const updateAdminProduct = (productId, product) => apiRequest(`/api/admin/products/${productId}`, "PUT", product);
export const deleteAdminProduct = (productId) => apiRequest(`/api/admin/products/${productId}`, "DELETE");
export const updateAdminProductStatus = (productId, isActive) => apiRequest(`/api/admin/products/${productId}/status`, "PUT", { isActive });
export const updateAdminProductStock = (productId, stockQuantity) => apiRequest(`/api/admin/products/${productId}/stock`, "PUT", { stockQuantity });
