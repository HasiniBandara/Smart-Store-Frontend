import type { CartItem } from "../App";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

interface CartProps {
  cart: CartItem[];
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Cart = ({ cart, clearCart, setCart }: CartProps) => {
  // All past orders
  const [allOrders, setAllOrders] = useState<CartItem[][]>([]);

  // Last confirmed order from current session 
  // const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);

  const navigate = useNavigate();

  // Load past orders from localStorage 
  useEffect(() => {
    const savedOrders: CartItem[][] = JSON.parse(localStorage.getItem("orders") || "[]");
    if (savedOrders.length > 0) {
      setAllOrders(savedOrders);
      // setLastOrder(savedOrders[savedOrders.length - 1]);
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

    // frontend display 
    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Save order preview in localStorage (for use in Payment page or if they navigation back)
    localStorage.setItem("pending_order", JSON.stringify(orderItems));

    navigate("/payment");
  };

  // const handleBuyAgain = () => {
  //   if (lastOrder) {
  //     setCart(lastOrder);
  //   }
  // };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const lastOrderTotal = lastOrder?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const finalTotal = total;

  return (
    <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans">
      <Navbar />

      {/* HEADER */}
      <div className="px-10 lg:px-24 py-10">
        <h1 className="text-4xl font-bold mb-2">Your Basket</h1>
        <p className="text-gray-500">
          Review your artisanal selections before checkout.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-10 px-10 lg:px-24 pb-20">

        {/* LEFT SIDE */}
        <div className="space-y-6">
          {cart.length === 0 ? (
            <div className="bg-white p-10 rounded-xl text-center shadow-sm">
              <p className="mb-4 text-gray-500">Your basket is empty</p>


              {allOrders.length > 0 && (
                <button
                  onClick={() => navigate("/orders")}
                  className="w-fit bg-primary text-white px-4 py-3 rounded-full mt-6 hover:bg-primary"
                >
                  View Previous Order History
                </button>
              )}
              {/* {lastOrder && (
                <div>
                  <p className="font-semibold mb-2">Last Order</p>
                  <div className="space-y-1 mb-4">
                    {lastOrder.slice(0, 3).map((item) => (
                      <p key={item.id} className="text-sm opacity-80">
                        • {item.name} (x{item.quantity})
                      </p>
                    ))}
                    {lastOrder.length > 3 && (
                      <p className="text-xs opacity-60">...and {lastOrder.length - 3} more items</p>
                    )}
                  </div>
                  <p className="font-bold mb-4">Total: Rs. {lastOrderTotal}</p>

                  <button
                    onClick={handleBuyAgain}
                    className="bg-primary text-white px-5 py-2 rounded-full"
                  >
                    Buy Again
                  </button>
                </div>
              )} */}
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 flex justify-between items-center shadow-sm"
              >
                {/* LEFT INFO */}
                <div className="flex items-center gap-4">

                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Rs. {item.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-2 bg-gray-100 px-3 py-1 rounded-full w-fit">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>

                {/* RIGHT PRICE */}
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    Rs. {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => updateQuantity(item.id, 0)}
                    className="text-sm text-primary mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {total}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="border-t my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">Rs. {finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-primary text-white py-3 rounded-full mt-6 hover:bg-primary"
          >
            Confirm Order
          </button>

          <button
            onClick={clearCart}
            className="w-full border mt-3 py-2 rounded-full text-sm"
          >
            Delete Order
          </button>

          {/* ORDER HISTORY */}

        </div>
      </div>
    </div>
  );
};

export default Cart;