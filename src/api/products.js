import { apiRequest } from "./client";

/**
 * Fetch all categories with product counts
 * Categories are filtered by user's segment on the backend
 */
export async function getCategories() {
  return apiRequest("/products/categories");
}

/**
 * Fetch products, optionally filtered by category
 * @param {string} category - Optional category filter
 */
export async function getProducts(category = null) {
  const path = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";
  return apiRequest(path);
}

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 */
export async function getProductById(id) {
  return apiRequest(`/products/${id}`);
}
