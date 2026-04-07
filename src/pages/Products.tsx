import { useState } from "react";
import type { CartItem } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
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
        const formattedData = data.map((p: any) => ({
          ...p,
          price: Number(p.price), // ✅ fix price
          category: p.category.toLowerCase().includes("cake")
            ? "cake"
            : "cookie", // ✅ fix category
        }));

        setProducts(formattedData);
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
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add products to cart!");
      return;
    }

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
    <div className="bg-[#f5f0f2] min-h-screen px-10 font-main">
      <Navbar />

      {["cake", "cookie"].map((cat) => (
        <div key={cat} className="mb-14 text-center">

          <h2 className="text-3xl font-bold text-primary mb-8 uppercase">
            {cat === "cake" ? "Cakes" : "Cookies"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products
              .filter((p) => p.category === cat)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-primary text-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
                >
                  {/* IMAGE (you can replace with real image later) */}
                  <div className="w-24 h-24 bg-white rounded-lg mb-4" />

                  <h3 className="text-lg font-bold">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-200 text-center mt-2">
                    {/* {product.description} */}
                    Delicious and fresh
                  </p>
                  <p className="mt-3 font-normal text-sm">
                    In Stock: {product.stock}
                  </p>
                  <p className="mt-3 font-semibold">
                    Rs. {Number(product.price).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4 bg-white text-primary rounded-full px-3 py-1">
                    <button
                      onClick={() => decrease(product.id)}
                      className="font-bold px-2"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {cartCount[product.id] || 0}
                    </span>

                    <button
                      onClick={() => increase(product.id, product.stock)}
                      className="font-bold px-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Add to cart button */}
      <div className="text-center mt-6">
        <button
          onClick={confirmOrder}
          className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Products;