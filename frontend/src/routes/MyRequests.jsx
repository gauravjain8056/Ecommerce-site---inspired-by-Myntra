import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api";

const StatusBadge = ({ status }) => {
    const colors = {
        pending: { bg: "#fff3cd", color: "#856404" },
        approved: { bg: "#d1e7dd", color: "#0f5132" },
        rejected: { bg: "#f8d7da", color: "#842029" },
    };
    const s = colors[status] || colors.pending;
    return (
        <span
            style={{
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                background: s.bg,
                color: s.color,
                textTransform: "capitalize",
            }}
        >
            {status}
        </span>
    );
};

const MyRequests = () => {
    const auth = useSelector((s) => s.auth);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!auth.token || auth.user?.role !== "customer") {
            navigate("/");
            return;
        }
        const fetchRequests = async () => {
            try {
                const { data } = await axios.get(`${API}/buy-requests/my`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setRequests(data.requests);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [auth.token, auth.user, navigate]);

    return (
        <main>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
                <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
                    My Requests
                </h1>
                <p style={{ color: "#888", marginBottom: 24 }}>
                    Track the status of your buy requests here.
                </p>

                {loading ? (
                    <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>
                        Loading your requests…
                    </p>
                ) : error ? (
                    <p style={{ color: "#e53935", textAlign: "center", padding: "2rem" }}>
                        ⚠️ {error}
                    </p>
                ) : requests.length === 0 ? (
                    <div
                        style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}
                    >
                        <div style={{ fontSize: 52 }}>📩</div>
                        <p style={{ marginTop: 8 }}>
                            {"You haven't sent any buy requests yet."}
                        </p>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {requests.map((r) => (
                            <div
                                key={r._id}
                                style={{
                                    border: "1px solid #eee",
                                    borderRadius: 10,
                                    padding: "14px 18px",
                                    background: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    flexWrap: "wrap",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                            >
                                {/* Product image */}
                                {r.product?.image && (
                                    <img
                                        src={r.product.image}
                                        alt={r.product.name}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                )}

                                {/* Product info */}
                                <div style={{ flex: "1 1 160px" }}>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                                        {r.product?.name || "Product removed"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#888" }}>
                                        ₹{r.product?.price || "N/A"}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "#aaa",
                                            textTransform: "uppercase",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        QTY
                                    </div>
                                    <div style={{ fontWeight: 800, fontSize: 20 }}>
                                        {r.quantity}
                                    </div>
                                </div>

                                {/* Date */}
                                <div style={{ fontSize: 12, color: "#999", minWidth: 90 }}>
                                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>

                                {/* Status */}
                                <StatusBadge status={r.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyRequests;
