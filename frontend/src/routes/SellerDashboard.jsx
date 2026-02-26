import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api";

const CATEGORIES = ["Men", "Women", "Kids", "Home & Living", "Beauty", "Studio"];

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Men",
    stock: "",
};

// ─── Status badge helper ────────────────────────────────────────────────────
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
                padding: "3px 10px",
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

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const SellerDashboard = () => {
    const auth = useSelector((s) => s.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user || auth.user.role !== "seller") navigate("/");
    }, [auth.user, navigate]);

    const [tab, setTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loadingP, setLoadingP] = useState(false);
    const [loadingR, setLoadingR] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const authHeader = { headers: { Authorization: `Bearer ${auth.token}` } };

    const fetchProducts = useCallback(async () => {
        setLoadingP(true);
        try {
            const { data } = await axios.get(`${API}/products`);
            setProducts(data.products);
        } catch { /* ignore */ }
        finally { setLoadingP(false); }
    }, []);

    const fetchRequests = useCallback(async () => {
        setLoadingR(true);
        try {
            const { data } = await axios.get(`${API}/buy-requests`, authHeader);
            setRequests(data.requests);
        } catch { /* ignore */ }
        finally { setLoadingR(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.token]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);
    useEffect(() => { if (tab === "requests") fetchRequests(); }, [tab, fetchRequests]);

    // ── Form helpers ────────────────────────────────────────────────────────
    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setImageFile(null);
        setImagePreview(null);
        setFormError("");
        setShowForm(true);
    };

    const openEdit = (product) => {
        setForm({
            name: product.name,
            description: product.description || "",
            price: product.price,
            originalPrice: product.originalPrice || "",
            category: product.category || "Men",
            stock: product.stock ?? "",
        });
        setEditId(product._id);
        setImageFile(null);
        setImagePreview(product.image || null);
        setFormError("");
        setShowForm(true);
    };

    const handleFormChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");
        try {
            // Use FormData for multipart upload
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", Number(form.price));
            formData.append("originalPrice", Number(form.originalPrice) || Number(form.price));
            formData.append("category", form.category);
            formData.append("stock", Number(form.stock) || 0);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            if (editId) {
                await axios.put(`${API}/products/${editId}`, formData, config);
            } else {
                await axios.post(`${API}/products`, formData, config);
            }
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to save product.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`${API}/products/${id}`, authHeader);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete.");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${API}/buy-requests/${id}`, { status }, authHeader);
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status.");
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontWeight: 800, fontSize: 26, margin: 0 }}>Seller Dashboard</h1>
                    <p style={{ color: "#888", margin: "4px 0 0" }}>Welcome back, {auth.user?.name}</p>
                </div>
                {tab === "products" && (
                    <button onClick={openCreate} style={{ padding: "10px 20px", background: "#ff3f6c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                        + Add Product
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "2px solid #eee", marginBottom: 24 }}>
                {["products", "requests"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                            padding: "10px 24px", border: "none", background: "none",
                            fontWeight: tab === t ? 700 : 400, fontSize: 15,
                            borderBottom: tab === t ? "2px solid #ff3f6c" : "2px solid transparent",
                            color: tab === t ? "#ff3f6c" : "#555",
                            cursor: "pointer", marginBottom: -2, textTransform: "capitalize",
                        }}
                    >
                        {t === "products" ? "📦 Products" : `📩 Buy Requests ${requests.length > 0 ? `(${requests.filter(r => r.status === "pending").length} pending)` : ""}`}
                    </button>
                ))}
            </div>

            {/* Products Tab */}
            {tab === "products" && (
                <div>
                    {loadingP ? (
                        <p style={{ color: "#888" }}>Loading products…</p>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                            <div style={{ fontSize: 48 }}>📦</div>
                            <p>No products yet. Click &quot;+ Add Product&quot; to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                            {products.map((p) => (
                                <div key={p._id} style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                                    {p.image && <img src={p.image} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />}
                                    <div style={{ padding: "12px 14px" }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                                        <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{p.category}</div>
                                        <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 12 }}>
                                            <span style={{ fontWeight: 700, color: "#333" }}>₹{p.price}</span>
                                            {p.originalPrice > p.price && <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>₹{p.originalPrice}</span>}
                                            <span style={{ fontSize: 12, color: "#888" }}>Stock: {p.stock}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button onClick={() => openEdit(p)} style={{ flex: 1, padding: "8px 0", border: "1.5px solid #ff3f6c", background: "transparent", color: "#ff3f6c", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Edit</button>
                                            <button onClick={() => handleDelete(p._id)} style={{ flex: 1, padding: "8px 0", border: "1.5px solid #e53935", background: "transparent", color: "#e53935", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Buy Requests Tab */}
            {tab === "requests" && (
                <div>
                    {loadingR ? (
                        <p style={{ color: "#888" }}>Loading requests…</p>
                    ) : requests.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                            <div style={{ fontSize: 48 }}>📩</div>
                            <p>No buy requests yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {requests.map((r) => (
                                <div key={r._id} style={{ border: "1px solid #eee", borderRadius: 10, padding: "14px 18px", background: "#fff", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center", flex: "1 1 220px" }}>
                                        {r.product?.image && <img src={r.product.image} alt={r.product.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8 }} />}
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>{r.product?.name}</div>
                                            <div style={{ fontSize: 12, color: "#888" }}>₹{r.product?.price}</div>
                                        </div>
                                    </div>
                                    <div style={{ flex: "1 1 160px" }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.customer?.name}</div>
                                        <div style={{ fontSize: 12, color: "#888" }}>{r.customer?.email}</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>Qty</div>
                                        <div style={{ fontWeight: 800, fontSize: 20 }}>{r.quantity}</div>
                                    </div>
                                    {r.message && <div style={{ flex: "1 1 200px", fontSize: 13, color: "#555", fontStyle: "italic" }}>&quot;{r.message}&quot;</div>}
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                        <StatusBadge status={r.status} />
                                        {r.status === "pending" && (
                                            <>
                                                <button onClick={() => updateStatus(r._id, "approved")} style={{ padding: "6px 14px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Approve</button>
                                                <button onClick={() => updateStatus(r._id, "rejected")} style={{ padding: "6px 14px", background: "#c62828", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Add / Edit Product Modal ── */}
            {showForm && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={() => setShowForm(false)}
                >
                    <div
                        style={{ background: "#fff", borderRadius: 12, padding: "2rem", width: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999" }}>×</button>
                        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>
                            {editId ? "Edit Product" : "Add New Product"}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            {/* Product Name */}
                            <div style={{ marginBottom: 12 }}>
                                <label style={labelStyle}>Product Name *</label>
                                <input type="text" name="name" value={form.name} onChange={handleFormChange} required style={inputStyle} />
                            </div>

                            {/* Price */}
                            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Price (₹) *</label>
                                    <input type="number" name="price" value={form.price} onChange={handleFormChange} required style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Original Price (₹)</label>
                                    <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleFormChange} style={inputStyle} />
                                </div>
                            </div>

                            {/* Stock + Category */}
                            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Stock Quantity</label>
                                    <input type="number" name="stock" value={form.stock} onChange={handleFormChange} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Category *</label>
                                    <select name="category" value={form.category} onChange={handleFormChange} style={inputStyle}>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div style={{ marginBottom: 12 }}>
                                <label style={labelStyle}>Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "block", marginTop: 4, fontSize: 14 }}
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ marginTop: 8, width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                                    />
                                )}
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Description</label>
                                <textarea name="description" rows={3} value={form.description} onChange={handleFormChange} style={{ ...inputStyle, resize: "vertical" }} />
                            </div>

                            {formError && <p style={{ color: "#e53935", fontSize: 13, marginBottom: 10 }}>{formError}</p>}

                            <button
                                type="submit"
                                disabled={formLoading}
                                style={{ width: "100%", padding: "11px 0", background: "#ff3f6c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: formLoading ? "not-allowed" : "pointer", opacity: formLoading ? 0.7 : 1 }}
                            >
                                {formLoading ? "Saving…" : editId ? "Save Changes" : "Create Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const labelStyle = { fontSize: 13, color: "#555", display: "block", marginBottom: 2 };
const inputStyle = {
    display: "block", width: "100%", padding: "9px 12px", marginTop: 4,
    border: "1.5px solid #ddd", borderRadius: 7, fontSize: 14, boxSizing: "border-box",
};

export default SellerDashboard;
