import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://mifra-enterprises-website.vercel.app',
})

export async function getProducts() {
	const response = await api.get('/api/products/')
	return response.data
}

export async function getProduct(id) {
	const response = await api.get(`/api/products/${encodeURIComponent(id)}`)
	return response.data
}

export async function getCategories() {
	const response = await api.get('/api/categories/')
	return response.data
}

export async function getSiteSettings() {
	const response = await api.get('/api/site-settings/')
	return response.data
}

export async function getServices() {
	const response = await api.get('/api/services/')
	return response.data
}

export async function getService(id) {
	const response = await api.get(`/api/services/${encodeURIComponent(id)}`)
	return response.data
}

export async function createProductRequest(data) {
	const response = await api.post('/api/product-requests/', data)
	return response.data
}

export async function createServiceRequest(data) {
	const response = await api.post('/api/service-requests/', data)
	return response.data
}

export async function createContactMessage(data) {
	const response = await api.post('/api/contact/', data)
	return response.data
}
