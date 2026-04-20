import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products addToCart={addToCart} />} />
      <Route
        path="/cart"
        element={
          <Cart
            cart={cart}
            clearCart={clearCart}
            setCart={setCart}
          />
        }
      />
      <Route path="/payment" element={<Payment cart={cart} setCart={setCart} />} />

      <Route path="/orders" element={<Orders />} />
      <Route path="/login" element={<Login />} />

      <Route path="/products/:category" element={<Products addToCart={addToCart} />} />
    </Routes>
  );
}

export default App;