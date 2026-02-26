import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import API_BASE from "../config/api";

const API = API_BASE + "/auth";

const AuthModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const endpoint = mode === "login" ? "/login" : "/register";
            const payload =
                mode === "login"
                    ? { email: form.email, password: form.password }
                    : { name: form.name, email: form.email, password: form.password };

            const { data } = await axios.post(`${API}${endpoint}`, payload);
            dispatch(loginSuccess({ token: data.token, user: data.user }));
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal-overlay"
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
                className="modal-box"
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "2rem",
                    width: 380,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tabs */}
                <div style={{ display: "flex", marginBottom: "1.4rem", gap: 8 }}>
                    {["login", "register"].map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError(""); }}
                            style={{
                                flex: 1,
                                padding: "10px 0",
                                border: "none",
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: 15,
                                cursor: "pointer",
                                background: mode === m ? "#ff3f6c" : "#f0f0f0",
                                color: mode === m ? "#fff" : "#555",
                                transition: "all 0.2s",
                            }}
                        >
                            {m === "login" ? "Login" : "Register"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {mode === "register" && (
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 13, color: "#555" }}>Full Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                                style={inputStyle}
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, color: "#555" }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 13, color: "#555" }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#e53935", fontSize: 13, marginBottom: 12 }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "11px 0",
                            background: "#ff3f6c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
                    </button>
                </form>

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
            </div>
        </div>
    );
};

const inputStyle = {
    display: "block",
    width: "100%",
    padding: "9px 12px",
    marginTop: 4,
    border: "1.5px solid #ddd",
    borderRadius: 7,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
};

export default AuthModal;
