import type { CartItem } from "../App";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

interface CartProps {
  cart: CartItem[];
  clearCart: () => void;
}

const Cart = ({ cart, clearCart }: CartProps) => {
  // All past orders
  const [allOrders, setAllOrders] = useState<CartItem[][]>([]);

  // Last confirmed order from current session (for success message)
  const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);

  // Load past orders from localStorage when component mounts
  useEffect(() => {
    const savedOrders: CartItem[][] = JSON.parse(localStorage.getItem("orders") || "[]");
    if (savedOrders.length > 0) {
      setAllOrders(savedOrders);
      setLastOrder(savedOrders[savedOrders.length - 1]);
    }
  }, []);

  const handleConfirm = async () => {
    if (cart.length === 0) {
      alert("Please select at least one product!");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // Send request to backend to reduce stock
      await fetch("http://localhost:3000/products/reduce-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderItems),
      });

      // Save order in localStorage
      const savedOrders: CartItem[][] = JSON.parse(localStorage.getItem("orders") || "[]");
      savedOrders.push(orderItems);
      localStorage.setItem("orders", JSON.stringify(savedOrders));

      // Update state
      setAllOrders(savedOrders);
      setLastOrder(orderItems);

      // Clear cart for next order
      clearCart();
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-light min-h-screen font-main pl-10 pr-10">
      <Navbar />

      <h1 className="text-3xl font-bold text-primary mb-8 border-b pb-4">Your Cart</h1>

      {/* Success message for last confirmed order */}
      {lastOrder && lastOrder.length > 0 && (
        <div className="mb-6 bg-green-100 p-5 rounded-2xl border border-green-300 shadow">
          <h2 className="text-green-800 font-bold text-xl mb-3 flex items-center gap-2">
            Last Order Confirmed!
          </h2>
          <ul className="list-none list-inside text-green-700 ml-5">
            {lastOrder.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} × Rs. {item.price} = Rs. {item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show all past orders except last one */}
      {allOrders.length > 1 && (
        <div className="mb-6">
          <h2 className="text-primary font-bold text-xl mb-3">Previous Orders</h2>
          {allOrders.slice(0, -1).map((order, idx) => (
            <div key={idx} className="mb-3 bg-white p-4 rounded-2xl shadow">
              <h3 className="font-semibold text-secondary mb-2">Order #{idx + 1}</h3>
              <ul className="ml-5 text-gray-700">
                {order.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} × Rs. {item.price} = Rs. {item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Current cart items */}
      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-xl font-semibold text-primary">{item.name}</h3>
                <p className="text-gray-600">
                  Rs. {item.price} × {item.quantity}
                </p>
              </div>
              <div className="text-lg font-bold text-secondary">
                Rs. {item.price * item.quantity}
              </div>
            </div>
          ))}

          {/* Total & Buttons */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow text-lg font-bold">
            <div className="mb-4 md:mb-0">
              Total: <span className="text-green-600">Rs. {total}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition"
              >
                Clear Cart
              </button>

              {/* Confirm button only shows if cart has items */}
              {cart.length > 0 && (
                <button
                  onClick={handleConfirm}
                  className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
                >
                  Confirm Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;