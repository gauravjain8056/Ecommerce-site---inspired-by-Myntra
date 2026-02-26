import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const API = "http://localhost:8080/api";

const BuyRequestModal = ({ product, onClose }) => {
    const token = useSelector((s) => s.auth.token);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await axios.post(
                `${API}/buy-requests`,
                { productId: product._id, quantity, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus("success");
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Request failed.");
            setStatus("error");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "2rem",
                    width: 380,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 12, right: 16,
                        background: "none",
                        border: "none",
                        fontSize: 22,
                        cursor: "pointer",
                        color: "#999",
                    }}
                >
                    ×
                </button>

                {status === "success" ? (
                    <div style={{ textAlign: "center", padding: "1rem 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                        <h3 style={{ color: "#2e7d32", fontWeight: 700 }}>Request Submitted!</h3>
                        <p style={{ color: "#555", fontSize: 14 }}>
                            Your buy request for <strong>{product.name}</strong> has been sent to the seller.
                        </p>
                        <button
                            onClick={onClose}
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
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Send Buy Request</h3>
                        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                            Product: <strong>{product.name}</strong> — ₹{product.price}
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, color: "#555" }}>Requested Quantity</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "9px 12px",
                                        marginTop: 4,
                                        border: "1.5px solid #ddd",
                                        borderRadius: 7,
                                        fontSize: 14,
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 13, color: "#555" }}>
                                    Message to Seller (optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Any specific requirements…"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "9px 12px",
                                        marginTop: 4,
                                        border: "1.5px solid #ddd",
                                        borderRadius: 7,
                                        fontSize: 14,
                                        resize: "vertical",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            {status === "error" && (
                                <p style={{ color: "#e53935", fontSize: 13, marginBottom: 10 }}>{errorMsg}</p>
                            )}
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                style={{
                                    width: "100%",
                                    padding: "11px 0",
                                    background: "#ff3f6c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    cursor: status === "loading" ? "not-allowed" : "pointer",
                                    opacity: status === "loading" ? 0.7 : 1,
                                }}
                            >
                                {status === "loading" ? "Submitting…" : "Submit Request"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BuyRequestModal;
