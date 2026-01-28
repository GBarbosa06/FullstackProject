// API Service para chamadas HTTP com JWT token
const API_BASE = 'http://localhost:8080';

// Função auxiliar para obter headers com token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Função para tratar erros
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// ==================== CATEGORIES ====================
export const categoryService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/categories`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE}/categories/find/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    create: async (categoryData) => {
        const response = await fetch(`${API_BASE}/categories/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    update: async (categoryData) => {
        const response = await fetch(`${API_BASE}/categories`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE}/categories?id=${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== PRODUCTS ====================
export const productService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE}/products/find/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    create: async (productData) => {
        const response = await fetch(`${API_BASE}/products/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    update: async (productData) => {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE}/products/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== STOCK ====================
export const stockService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/stock`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    create: async (stockData) => {
        const response = await fetch(`${API_BASE}/stock/add`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(stockData)
        });
        return handleResponse(response);
    },

    update: async (stockData) => {
        const response = await fetch(`${API_BASE}/stock`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(stockData)
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE}/stock/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== USERS ====================
export const userService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE}/users/find/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    update: async (userData) => {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE}/users/delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

export default {
    category: categoryService,
    product: productService,
    stock: stockService,
    user: userService
};

