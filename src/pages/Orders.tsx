import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE_URL, getAuthToken, getUserIdFromToken } from "../utils/api";

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = getAuthToken();
                const userId = getUserIdFromToken();

                const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Log in to see the order history");

                const data = await res.json();
                setOrders(data);
            } catch (err: any) {
                console.error("Orders fetch error:", err);
                setError(err.message || "Failed to load order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans transition-opacity duration-500 opacity-100">
            <Navbar />

            <div className="max-w-4xl mx-auto py-10">
                <h1 className="text-3xl font-bold text-primary text-center mb-10">
                    Your Order History
                </h1>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 animate-pulse">Loading orders...</p>
                    </div>
                ) : error && orders.length === 0 ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
                        <p>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow text-center">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4 border-b pb-4">
                                    <div>
                                        <h2 className="font-bold text-lg">Order #{order.id}</h2>
                                        <p className="text-xs text-gray-400">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent Order'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-xl">Rs. {Number(order.total_price).toFixed(2)}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {(order.cartItems || []).map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {item.product?.name || item.name}
                                                <span className="text-xs ml-2 opacity-60">x{item.quantity}</span>
                                            </span>
                                            <span className="font-medium">
                                                Rs. {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {order.paymentGateway && (
                                    <div className="mt-4 pt-4 border-t flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
                                        <span>Paid via {order.paymentGateway}</span>
                                        {order.transactionId && <span>TXID: {order.transactionId}</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;