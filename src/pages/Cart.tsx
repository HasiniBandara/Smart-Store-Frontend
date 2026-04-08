import type { CartItem } from "../App";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface CartProps {
  cart: CartItem[];
  clearCart: () => void;
  confirmCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; // ✅ ADD THIS
}

const Cart = ({ cart, clearCart, setCart }: CartProps) => {
  // All past orders
  const [allOrders, setAllOrders] = useState<CartItem[][]>([]);

  // Last confirmed order from current session 
  const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);

  const navigate = useNavigate();

  // Load past orders from localStorage 
  useEffect(() => {
    const savedOrders: CartItem[][] = JSON.parse(localStorage.getItem("orders") || "[]");
    if (savedOrders.length > 0) {
      setAllOrders(savedOrders);
      setLastOrder(savedOrders[savedOrders.length - 1]);
    }
  }, []);

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 0) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );

    // remove items with 0 quantity
    const filtered = updatedCart.filter((item) => item.quantity > 0);

    // update parent state (you need this prop)
    setCart(filtered);
  };

  const handleConfirm = async () => {
    if (cart.length === 0) {
      alert("Please select at least one product!");
      return;
    }

    try {
      // backend 
      const reduceItems = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // frontend display 
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await fetch("http://localhost:3000/products/reduce-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reduceItems }),
      });

      // Save order in localStorage
      const savedOrders: CartItem[][] = JSON.parse(localStorage.getItem("orders") || "[]");
      savedOrders.push(orderItems);
      localStorage.setItem("orders", JSON.stringify(savedOrders));

      // Update UI
      setAllOrders(savedOrders);
      setLastOrder(orderItems);

      navigate("/payment");

    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-[#f5f0f2] min-h-screen px-10 font-main">
      <Navbar />

      <h1 className="text-3xl font-bold text-primary text-center mb-8">
        CART
      </h1>

      <div className="bg-primary text-white rounded-2xl p-8 grid md:grid-cols-[2fr_1fr] gap-8">

        {/* LEFT SIDE - CART ITEMS */}
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {/* Header Row (optional) */}
              <div className="grid grid-cols-3 gap-4 font-bold mb-2 text-center">
                <span></span>
                <span></span>
                <span className="ml-28">Total</span>
              </div>

              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_1fr_1fr] gap-4 items-center mb-4 mx-5"
                >
                  {/* Column 1: Item info */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-lg" />

                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm">Rs. {item.price}</p>
                    </div>
                  </div>

                  {/* Column 2: Quantity controls */}
                  <div className="flex items-center gap-2 bg-white text-primary py-1 rounded-full justify-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="font-bold px-2"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="font-bold px-2"
                    >
                      +
                    </button>
                  </div>

                  {/* Column 3: Total price */}
                  <p className="font-semibold text-right">
                    Rs. {item.price * item.quantity}
                  </p>
                </div>
              ))}

              {/* Subtotal */}
              <div className="flex justify-between font-bold mt-6 pt-4 mx-4">
                <span>Sub Total</span>
                <span>Rs. {total}</span>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE - PICKUP CARD */}
        <div className="bg-white text-primary rounded-2xl p-6 shadow">
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 text-white py-2 rounded-full mb-2"
          >
            Confirm Order
          </button>

          <button
            onClick={clearCart}
            className="w-full bg-red-800 text-white py-2 rounded-full"
          >
            Delete Order
          </button>

          {/* Previous Orders */}
          {allOrders.length > 1 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/orders")}
                className="bg-primary text-white px-6 py-2 rounded-full shadow"
              >
                View Previous Orders
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;