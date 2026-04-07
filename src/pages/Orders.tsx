import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(saved);
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f0f2] px-10">
            <Navbar />

            <h1 className="text-3xl font-bold text-primary text-center mb-10">
                Previous Orders
            </h1>

            {orders.length === 0 ? (
                <p>No previous orders</p>
            ) : (
                orders.map((order, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl shadow mb-4">
                        <h2 className="font-semibold mb-2">Order #{index + 1}</h2>

                        {order.map((item: any) => (
                            <p key={item.id}>
                                {item.name} - {item.quantity} × Rs. {item.price}
                            </p>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;