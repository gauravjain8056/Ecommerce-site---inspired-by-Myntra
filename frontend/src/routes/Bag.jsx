import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bagActions } from "../store/bagSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/api";

const Bag = () => {
  const cartItems = useSelector((store) => store.bag);
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Price calculations
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalMRP = cartItems.reduce(
    (sum, i) => sum + (i.product.originalPrice || i.product.price) * i.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const totalDiscount = totalMRP - totalPrice;

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(bagActions.updateQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(bagActions.removeFromBag(productId));
  };

  const handleSendRequest = async () => {
    if (!auth.token) {
      alert("Please login to send a buy request.");
      return;
    }
    if (cartItems.length === 0) return;

    setSubmitting(true);
    setError("");
    try {
      // Send one request per item in the cart
      const promises = cartItems.map((item) =>
        axios.post(
          `${API}/buy-requests`,
          { productId: item.productId, quantity: item.quantity },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
      );
      await Promise.all(promises);
      dispatch(bagActions.clearBag());
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send requests. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main>
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            Buy Requests Sent!
          </h2>
          <p style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>
            Your requests have been submitted to the seller. Check "My Requests"
            to track their status.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/my-requests")}
              style={{
                padding: "10px 28px",
                background: "#ff3f6c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View My Requests
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 28px",
                background: "#fff",
                color: "#333",
                border: "1.5px solid #ddd",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="bag-page" style={{ paddingTop: 24 }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#aaa" }}>
            <div style={{ fontSize: 52 }}>🛒</div>
            <p style={{ fontSize: 16, marginTop: 12 }}>Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: 16,
                padding: "10px 28px",
                background: "#ff3f6c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 20,
                color: "#282c3f",
              }}
            >
              Your Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </h2>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {/* ── Cart Items ── */}
              <div style={{ flex: "2 1 400px" }}>
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="bag-item-container"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    {/* Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                      >
                        {item.product.name}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#888",
                          marginBottom: 8,
                        }}
                      >
                        {item.product.category}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                        <span style={{ fontWeight: 700, color: "#282c3f" }}>
                          ₹{item.product.price}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                              fontSize: 12,
                            }}
                          >
                            ₹{item.product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        border: "1.5px solid #ddd",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        style={{
                          width: 34,
                          height: 34,
                          border: "none",
                          background: "#f5f5f6",
                          fontSize: 18,
                          fontWeight: 700,
                          cursor: item.quantity > 1 ? "pointer" : "not-allowed",
                          color: item.quantity > 1 ? "#333" : "#ccc",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          display: "inline-block",
                          width: 38,
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        style={{
                          width: 34,
                          height: 34,
                          border: "none",
                          background: "#f5f5f6",
                          fontSize: 18,
                          fontWeight: 700,
                          cursor: "pointer",
                          color: "#333",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div
                      style={{
                        minWidth: 80,
                        textAlign: "right",
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      ₹{item.product.price * item.quantity}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53935",
                        fontSize: 20,
                        cursor: "pointer",
                        padding: "4px 8px",
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* ── Summary Sidebar ── */}
              <div
                style={{
                  flex: "1 1 280px",
                  background: "#fff",
                  border: "1px solid #eaeaec",
                  borderRadius: 8,
                  padding: 20,
                  alignSelf: "flex-start",
                  position: "sticky",
                  top: 100,
                }}
              >
                <div
                  className="price-header"
                  style={{ fontSize: 12, fontWeight: 700, color: "#535766", marginBottom: 16 }}
                >
                  PRICE DETAILS ({totalItems} Item{totalItems !== 1 ? "s" : ""})
                </div>

                <div className="price-item" style={{ marginBottom: 10 }}>
                  <span>Total MRP</span>
                  <span className="price-item-value">₹{totalMRP}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="price-item" style={{ marginBottom: 10 }}>
                    <span>Discount on MRP</span>
                    <span className="price-item-value priceDetail-base-discount">
                      −₹{totalDiscount}
                    </span>
                  </div>
                )}
                <hr style={{ margin: "12px 0" }} />
                <div
                  className="price-footer"
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <span>Estimated Total</span>
                  <span>₹{totalPrice}</span>
                </div>

                {error && (
                  <p
                    style={{
                      color: "#e53935",
                      fontSize: 13,
                      marginBottom: 10,
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSendRequest}
                  disabled={submitting || !auth.token}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background: auth.token ? "#ff3f6c" : "#aaa",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor:
                      submitting || !auth.token ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    letterSpacing: 0.5,
                  }}
                >
                  {submitting
                    ? "Sending Requests…"
                    : auth.token
                      ? "SEND BUY REQUEST TO SELLER"
                      : "LOGIN TO SEND REQUEST"}
                </button>

                <p
                  style={{
                    fontSize: 11,
                    color: "#999",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  The seller will review your request and respond.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Bag;
