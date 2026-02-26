import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import HomeItem from "../components/HomeItem";

const API = "http://localhost:8080/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const url = category
          ? `${API}/products?category=${encodeURIComponent(category)}`
          : `${API}/products`;
        const { data } = await axios.get(url);
        setProducts(data.products);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Could not load products. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading)
    return (
      <main style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
        Loading products…
      </main>
    );

  if (error)
    return (
      <main style={{ textAlign: "center", padding: "4rem", color: "#e53935" }}>
        ⚠️ {error}
      </main>
    );

  if (products.length === 0)
    return (
      <main style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>
        <div style={{ fontSize: 52 }}>🛍️</div>
        <p>
          {category
            ? `No products found in "${category}" category.`
            : "No products listed yet. The seller hasn't added anything."}
        </p>
      </main>
    );

  return (
    <main>
      {category && (
        <h2
          style={{
            textTransform: "uppercase",
            color: "#3e4152",
            letterSpacing: "0.15em",
            fontSize: "1.5em",
            margin: "30px 0 0 10%",
            fontWeight: 700,
          }}
        >
          {category}
        </h2>
      )}
      <div className="items-container">
        {products.map((product) => (
          <HomeItem key={product._id} item={product} />
        ))}
      </div>
    </main>
  );
};

export default Home;
