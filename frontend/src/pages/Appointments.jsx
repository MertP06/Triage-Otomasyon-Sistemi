import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiGet, apiPatch } from "../api";

const STATUS_COLORS = {
    WAITING: "gray",
    CALLED: "ok",
    IN_PROGRESS: "warn",
    DONE: "ok",
    CANCELED: "danger",
};

export default function Appointments() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    const load = async () => {
        if (!user) return; // 🔐 Kullanıcı bilgisi gelmeden istek atma
        setLoading(true);
        try {
            const qs = status ? `?status=${status}` : "";
            const data = await apiGet(`/api/appointments/today${qs}`, user);
            setItems(data);
        } catch (e) {
            console.error("Randevular çekilemedi:", e);
            alert("Randevular çekilemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) load(); // 🧠 user geldikten sonra yükleme yap
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, user]); // ✅ user’ı dependency list’e ekle

    const updateStatus = async (id, next) => {
        try {
            await apiPatch(`/api/appointments/${id}/status?status=${next}`, user);
            load();
        } catch (e) {
            console.error("Durum güncellenemedi:", e);
            alert("Durum güncellenemedi");
        }
    };

    return (
        <div className="container" style={{ marginTop: 20 }}>
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <select
                        className="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ maxWidth: 220 }}
                    >
                        <option value="">Tümü</option>
                        <option>WAITING</option>
                        <option>CALLED</option>
                        <option>IN_PROGRESS</option>
                        <option>DONE</option>
                        <option>CANCELED</option>
                    </select>
                    <button className="btn" onClick={load}>Yenile</button>
                    <div style={{ marginLeft: "auto" }}>
                        <input
                            className="input"
                            placeholder="ID ile hızlı işlem"
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            style={{ width: 160 }}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Sıra</th><th>Tarih</th><th>Durum</th><th>Hasta</th><th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6">Yükleniyor...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan="6">Kayıt yok</td></tr>
                        ) : items.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.queueNumber}</td>
                                <td>{a.appointmentDate}</td>
                                <td>
                                    <span className={`badge ${STATUS_COLORS[a.status] || "gray"}`}>
                                        {a.status}
                                    </span>
                                </td>
                                <td>
                                    {a.patient?.name}{" "}
                                    <span className="badge gray">{a.patient?.tc}</span>
                                </td>
                                <td style={{ display: "flex", gap: 8 }}>
                                    {(user.role === "NURSE" || user.role === "DOCTOR") && a.status === "WAITING" && (
                                        <button className="btn" onClick={() => updateStatus(a.id, "CALLED")}>Çağır</button>
                                    )}
                                    {(user.role === "NURSE" || user.role === "DOCTOR") && (
                                        <button className="btn" onClick={() => updateStatus(a.id, "IN_PROGRESS")}>Muayenede</button>
                                    )}
                                    {user.role === "DOCTOR" && (
                                        <button className="btn btn-primary" onClick={() => updateStatus(a.id, "DONE")}>Tamamla</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedId && (
                <div className="card" style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span>Hızlı durum değiştir (ID: {selectedId})</span>
                        <button className="btn" onClick={() => updateStatus(Number(selectedId), "IN_PROGRESS")}>
                            IN_PROGRESS
                        </button>
                        <button className="btn btn-primary" onClick={() => updateStatus(Number(selectedId), "DONE")}>
                            DONE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
