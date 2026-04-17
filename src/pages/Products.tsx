import { useState } from "react";
import type { CartItem } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  image: string;
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

  const { category } = useParams();

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

  const cat = category === "cookie" ? "cookie" : "cake";
  const filtered = products.filter((p) => p.category === cat);

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
    <div className="bg-[#f6f2f3] min-h-screen px-8 md:px-16 py-10 font-sans transition-opacity duration-500 opacity-100">
      <Navbar />

      {/* HERO */}
      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-bold text-primary">
          {cat === "cake"
            ? "Our Cake Collection"
            : "Our Cookie Collection"
          }

        </h1>
        <p className="text-gray-500 mt-4 max-w-xl">
          {cat === "cake"
            ? "Hand-sculpted cakes, crafted with meticulous attention to detail and flavor harmony."
            : "Hand-sculpted cookies, crafted with meticulous attention to detail and flavor harmony."
          }
        </p>
      </div>

      <div id={cat} className="mb-20">
        {/* SECTION HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs tracking-widest text-primary uppercase">
              Category
            </p>
            <h2 className="text-3xl font-semibold text-gray-900">
              {cat === "cake" ? "The Signature Cakes" : "Artisan Cookies"}
            </h2>
          </div>

          <p className="text-gray-400 text-sm">
            ({filtered.length} Varieties)
          </p>
        </div>

        {/* GRID */}
        <div
          className={`grid gap-8 ${cat === "cake" ? "md:grid-cols-3" : "md:grid-cols-3"
            }`}
        >
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* SAME CARD CODE */}
              {/* IMAGE */}
              <div className="relative mb-4">
                <div className="flex justify-center items-center">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 rounded-xl"
                  />
                </div>
                {product.stock > 0 ? (
                  <span className="absolute top-3 right-3 bg-green-700 text-white text-xs px-3 py-1 rounded-full">
                    IN STOCK
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span className="text-primary font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* CONTROLS */}
              <div className="flex justify-between items-center mt-5">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                  <button
                    onClick={() => decrease(product.id)}
                    className="text-lg px-2"
                  >
                    −
                  </button>

                  <span>{cartCount[product.id] || 0}</span>

                  <button
                    onClick={() =>
                      increase(product.id, product.stock)
                    }
                    className="text-lg px-2"
                  >
                    +
                  </button>
                </div>

                {/* <button
                      onClick={confirmOrder}
                      className="bg-primary hover:bg-primary text-white px-5 py-2 rounded-full text-sm shadow"
                    >
                      Add to Cart
                    </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* GLOBAL BUTTON */}
      <div className="text-center">
        <button
          onClick={confirmOrder}
          className="bg-primary hover:bg-primary text-white px-10 py-3 rounded-full shadow-md"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Products;