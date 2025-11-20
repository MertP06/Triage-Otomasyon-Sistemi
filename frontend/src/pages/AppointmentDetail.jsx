import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiGet } from "../api";

function Section({ title, children }) {
    return (
        <div className="card group">
            <div className="section-title"><h2>{title}</h2></div>
            {children}
        </div>
    );
}

export default function AppointmentDetail() {
    const { user } = useAuth();
    const [id, setId] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetail = async () => {
        if (!id || !user) return;
        setLoading(true);
        try {
            const res = await apiGet(`/api/appointments/${id}/detail`, user);
            setData(res);
        } catch (err) {
            console.error("Detay çekilemedi:", err);
            alert("Detay verisi alınamadı");
        } finally {
            setLoading(false);
        }
    };

    const ap = data?.appointment;
    const pt = data?.patient;
    const triages = data?.triageRecords || [];
    const notes = data?.doctorNotes || [];

    return (
        <div className="container">
            <div className="page-head">
                <div className="brand">📄 Detay</div>
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        className="input"
                        placeholder="Randevu ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={fetchDetail} disabled={loading}>
                        {loading ? "Yükleniyor..." : "Getir"}
                    </button>
                </div>
            </div>

            {data && (
                <>
                    <div className="grid-2">
                        <Section title="Hasta">
                            <div className="kv">
                                <div><span className="kv-k">Ad Soyad</span><span className="kv-v">{pt?.name}</span></div>
                                <div><span className="kv-k">TC</span><span className="kv-v">{pt?.tc}</span></div>
                                <div><span className="kv-k">Temel Semptomlar</span><span className="kv-v">{pt?.basicSymptomsCsv || "-"}</span></div>
                            </div>
                        </Section>

                        <Section title="Randevu">
                            <div className="kv">
                                <div><span className="kv-k">Sıra No</span><span className="kv-v">{ap?.queueNumber}</span></div>
                                <div><span className="kv-k">Tarih</span><span className="kv-v">{ap?.appointmentDate}</span></div>
                                <div>
                                    <span className="kv-k">Durum</span>
                                    <span className={`kv-v tag status-${String(ap?.status).toLowerCase()}`}>{ap?.status}</span>
                                </div>
                            </div>
                        </Section>
                    </div>

                    <Section title="Triage Kayıtları">
                        <div className="cards-list">
                            {triages.map((t) => {
                                const symptoms = t.nurseSymptomsCsv?.split(",").map(s => s.trim()).filter(Boolean) || [];

                                return (
                                    <div key={t.id} className="mini-card">
                                        <div className="mini-top">
                                            <span className={`tag ${String(t.triageLevel).toLowerCase()}`}>{t.triageLevel}</span>
                                            <span className="muted">{new Date(t.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="mini-grid">
                                            <div><span className="kv-k">Ateş</span><span className="kv-v">{t.temperature ?? "-"}</span></div>
                                            <div><span className="kv-k">Nabız</span><span className="kv-v">{t.pulse ?? "-"}</span></div>
                                            <div><span className="kv-k">TA</span><span className="kv-v">{t.bpHigh ?? "-"} / {t.bpLow ?? "-"}</span></div>
                                            <div><span className="kv-k">Ağrı</span><span className="kv-v">{t.painLevel ?? "-"}</span></div>
                                        </div>

                                        <div style={{ marginTop: 8 }}>
                                            <span className="kv-k">Semptomlar</span>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                                                {symptoms.map((s, idx) => (
                                                    <span key={idx} style={{
                                                        backgroundColor: "#2e2e3d",
                                                        color: "#f0f0f0",
                                                        padding: "4px 10px",
                                                        borderRadius: "12px",
                                                        fontSize: "13px"
                                                    }}>{s}</span>
                                                ))}
                                                {symptoms.length === 0 && <span className="muted">-</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {triages.length === 0 && <div className="muted">Kayıt yok.</div>}
                        </div>
                    </Section>

                    <Section title="Doktor Notları">
                        {notes.length === 0 && <div className="muted">Henüz not yok.</div>}
                        {notes.map((n) => (
                            <div key={n.id} className="mini-card">
                                <div className="mini-top">
                                    <span className="tag">Not</span>
                                    <span className="muted">{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="kv">
                                    <div><span className="kv-k">Tanı</span><span className="kv-v">{n.diagnosis}</span></div>
                                    <div><span className="kv-k">Plan</span><span className="kv-v">{n.plan}</span></div>
                                </div>
                            </div>
                        ))}
                    </Section>
                </>
            )}
        </div>
    );
}
