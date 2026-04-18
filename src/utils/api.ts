export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getAuthToken = () => localStorage.getItem("token");

export const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const getUserIdFromToken = () => {
    const token = getAuthToken();
    if (!token) return 1; // Default fallback if no token
    const decoded = decodeToken(token);
    return decoded?.id || decoded?.userId || decoded?.sub || 1;
};

export const saveOrderToBackend = async (orderData: {
    totalPrice: number;
    status: string;
    cartItems: any[];
    transactionId?: string;
    paymentGateway?: string;
}) => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            userId,
            ...orderData
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save order");
    }

    return await response.json();
};
