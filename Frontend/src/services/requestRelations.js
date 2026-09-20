import { getAdminProducts, getProduct, getService, getServices } from "./api";

export function normalizeId(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function resourceList(data, key) {
  return Array.isArray(data) ? data : data?.[key] || [];
}

function resourceMap(items) {
  return new Map(items.map((item) => [normalizeId(item.id), item.name]));
}

function requestResourceIds(requests, requestType, idField, objectField) {
  return [...new Set(requests
    .filter((request) => normalizeId(request.request_type).toLowerCase() === requestType)
    .map((request) => normalizeId(request[idField] ?? request[objectField]?.id))
    .filter(Boolean))];
}

async function addMissingResourceNames(map, ids, getResource) {
  const missingIds = ids.filter((id) => !map.has(id));
  const resources = await Promise.all(missingIds.map(async (id) => {
    try {
      return await getResource(id);
    } catch {
      return null;
    }
  }));
  resources.filter(Boolean).forEach((resource) => {
    if (resource.id && resource.name) map.set(normalizeId(resource.id), resource.name);
  });
}

export async function loadRequestRelations(requests) {
  const [productData, serviceData] = await Promise.all([getAdminProducts(), getServices()]);
  const productMap = resourceMap(resourceList(productData, "products"));
  const serviceMap = resourceMap(resourceList(serviceData, "services"));
  await Promise.all([
    addMissingResourceNames(productMap, requestResourceIds(requests, "product", "product_id", "product"), getProduct),
    addMissingResourceNames(serviceMap, requestResourceIds(requests, "service", "service_id", "service"), getService),
  ]);
  return { productMap, serviceMap };
}

export function requestItemName(request, productMap, serviceMap) {
  const requestType = normalizeId(request.request_type).toLowerCase();
  if (requestType === "product") {
    return request.product?.name
      ?? request.product_name
      ?? request.productName
      ?? productMap.get(normalizeId(request.product_id ?? request.productId ?? request.product?.id))
      ?? "Unavailable";
  }
  if (requestType === "service") {
    return request.service?.name
      ?? request.service_name
      ?? request.serviceName
      ?? serviceMap.get(normalizeId(request.service_id ?? request.serviceId ?? request.service?.id))
      ?? "Unavailable";
  }
  return "Unavailable";
}
