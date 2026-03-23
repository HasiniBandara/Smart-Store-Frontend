import { useState } from "react";
import type { CartItem } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: "cake" | "cookie";
};

interface ProductsProps {
  addToCart: (item: CartItem) => void;
}

const Products = ({ addToCart }: ProductsProps) => {

    const [products, setProducts] = useState<Product[]>([]);

  const [cartCount, setCartCount] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate(); 

  useEffect(() => {
  fetch("http://localhost:3000/products")
    .then((res) => res.json())
    .then((data) => {
        console.log("API DATA:", data);
      setProducts(data);
    })
    .catch((err) => console.error("Error fetching products:", err));
}, []);

  const increase = (id: number, stock: number) => {
    setCartCount((prev) => {
      const current = prev[id] || 0;
      if (current >= stock) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const decrease = (id: number) => {
    setCartCount((prev) => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  // Single confirm order button
  const confirmOrder = () => {
    let hasItems = false;
    products.forEach((product) => {
      const quantity = cartCount[product.id] || 0;
      if (quantity > 0) {
        addToCart({ id: product.id, name: product.name, price: product.price, quantity });
        hasItems = true;
      }
    });
    if (hasItems) {
      navigate("/cart"); 
    } else {
      alert("Please select at least one product!");
    }
  };

  return (
    <div className="bg-light min-h-screen pl-10 pr-10 font-main">

        <Navbar />
      <h1 className="text-3xl text-primary font-bold mb-6">Our Products</h1>

      {["cake", "cookie"].map((cat) => (
        <div key={cat} className="mb-10">
          <h2 className="text-2xl text-primary mb-4">
            {cat === "cake" ? "Cakes" : "Cookies"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category.toLowerCase().startsWith(cat))
              .map((product) => (
                <div key={product.id} className="bg-white p-5 rounded-2xl shadow">
                  <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
                  <p className="text-gray-600">Rs. {product.price}</p>
                  <p className="text-sm text-gray-500">Available: {product.stock}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button onClick={() => decrease(product.id)} className="bg-primary text-white px-3 rounded">-</button>
                    <span className="text-lg">{cartCount[product.id] || 0}</span>
                    <button onClick={() => increase(product.id, product.stock)} className="bg-primary text-white px-3 rounded">+</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Single Confirm Order Button */}
      <div className="mt-6">
        <button
          onClick={confirmOrder}
          className="bg-green-500 text-white px-6 py-3 rounded text-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Products;