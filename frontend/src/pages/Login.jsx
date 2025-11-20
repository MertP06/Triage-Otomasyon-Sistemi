import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [username, setUsername] = useState("nurse");
    const [password, setPassword] = useState("nurse123");

    const onSubmit = (e) => {
        e.preventDefault();
        login({ username, password });
        nav("/");
    };

    return (
        <div className="container" style={{ marginTop: 40 }}>
            <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
                <h2 style={{ marginTop: 0 }}>Giriş</h2>
                <p style={{ color: "#94a3b8" }}>Hemşire: nurse / nurse123 — Doktor: doctor / doctor123</p>
                <form onSubmit={onSubmit}>
                    <div style={{ display: "grid", gap: 12 }}>
                        <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanıcı adı" />
                        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" />
                        <button className="btn btn-primary">Giriş yap</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
