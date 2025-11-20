import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiGet, apiPost } from "../api";
import ProtectedRoute from "../components/ProtectedRoute";

function Badge({ tone = "gray", children }) {
    return <span className={`badge ${tone}`}>{children}</span>;
}

function SectionTitle({ title, subtitle }) {
    return (
        <div className="section-title">
            <h2>{title}</h2>
            {subtitle && <p className="hint">{subtitle}</p>}
        </div>
    );
}

function Pill({ active, onClick, children }) {
    return (
        <button type="button" className={`chip ${active ? "on" : ""}`} onClick={onClick}>
            {children}
        </button>
    );
}

function TriageFormInner() {
    const { user } = useAuth();

    const [symptoms, setSymptoms] = useState([]);
    const [q, setQ] = useState("");
    const [selected, setSelected] = useState([]);

    const [form, setForm] = useState({
        appointmentId: "",
        temperature: "",
        pulse: "",
        bpHigh: "",
        bpLow: "",
        painLevel: "",
        triageLevel: "SARI",
        notes: "",
    });

    const [result, setResult] = useState(null);
    const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    useEffect(() => {
        (async () => {
            const data = await apiGet("/api/medical/symptoms", user);
            setSymptoms(Array.isArray(data) ? data : []);
        })().catch(console.error);
    }, [user]);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return !qq ? symptoms : symptoms.filter((s) => s.toLowerCase().includes(qq));
    }, [symptoms, q]);

    const toggle = (sym) =>
        setSelected((prev) => (prev.includes(sym) ? prev.filter((x) => x !== sym) : [...prev, sym]));

    const submit = async (e) => {
        e.preventDefault();
        if (selected.length === 0) {
            alert("En az bir semptom seçmelisiniz.");
            return;
        }

        const payload = {
            appointmentId: Number(form.appointmentId || 0),
            nurseSymptomsCsv: selected.join(", "),
            temperature: form.temperature ? Number(form.temperature) : null,
            pulse: form.pulse ? Number(form.pulse) : null,
            bpHigh: form.bpHigh ? Number(form.bpHigh) : null,
            bpLow: form.bpLow ? Number(form.bpLow) : null,
            painLevel: form.painLevel ? Number(form.painLevel) : null,
            triageLevel: form.triageLevel || "SARI",
            notes: form.notes || null,
        };

        try {
            const data = await apiPost("/api/triage", payload, user);
            setResult(data);
            setSelected([]);
            setForm({
                appointmentId: "",
                temperature: "",
                pulse: "",
                bpHigh: "",
                bpLow: "",
                painLevel: "",
                triageLevel: "SARI",
                notes: "",
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error("Triage kaydı başarısız:", err);
            alert("Triage kaydı yapılamadı. Lütfen randevu ID ve giriş bilgilerini kontrol edin.");
        }
    };

    return (
        <div className="container">
            <div className="page-head">
                <div>
                    <div className="brand">🩺 Triage</div>
                    <span className="hint">Semptomları seç, yaşamsal bulguları gir, seviyeyi belirle.</span>
                </div>
                <Badge tone="gray">Rol: NURSE</Badge>
            </div>

            <div className="card group">
                <SectionTitle title="Randevu & Seviye" />
                <div className="row">
                    <input
                        className="input"
                        placeholder="Randevu ID"
                        value={form.appointmentId}
                        onChange={(e) => onChange("appointmentId", e.target.value)}
                        required
                    />
                    <select
                        className="select"
                        value={form.triageLevel}
                        onChange={(e) => onChange("triageLevel", e.target.value)}
                    >
                        <option value="YESIL">YEŞİL</option>
                        <option value="SARI">SARI</option>
                        <option value="KIRMIZI">KIRMIZI</option>
                    </select>
                </div>
            </div>

            <div className="card group">
                <SectionTitle
                    title="Semptomlar"
                    subtitle="Listeden seç; arama kutusuyla daraltabilirsin. Seçilenler aşağıda özetlenir."
                />
                <div className="row">
                    <input className="input" placeholder="Semptom ara…" value={q} onChange={(e) => setQ(e.target.value)} />
                    <div className="selected-info">
                        <Badge tone="ok">{selected.length} seçili</Badge>
                    </div>
                </div>

                <div className="symptom-grid">
                    {filtered.map((s) => (
                        <Pill key={s} active={selected.includes(s)} onClick={() => toggle(s)}>
                            {s}
                        </Pill>
                    ))}
                </div>

                {selected.length > 0 && (
                    <div className="selected-chips">
                        {selected.map((s) => (
                            <span key={s} className="chip on small" onClick={() => toggle(s)}>
                                {s} ✕
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="card group">
                <SectionTitle title="Yaşamsal Bulgular" />
                <div className="row-3">
                    <input className="input" placeholder="Ateş (°C)" value={form.temperature} onChange={(e) => onChange("temperature", e.target.value)} />
                    <input className="input" placeholder="Nabız (bpm)" value={form.pulse} onChange={(e) => onChange("pulse", e.target.value)} />
                    <input className="input" placeholder="Ağrı (0-10)" value={form.painLevel} onChange={(e) => onChange("painLevel", e.target.value)} />
                </div>
                <div className="row">
                    <input className="input" placeholder="Büyük Tansiyon" value={form.bpHigh} onChange={(e) => onChange("bpHigh", e.target.value)} />
                    <input className="input" placeholder="Küçük Tansiyon" value={form.bpLow} onChange={(e) => onChange("bpLow", e.target.value)} />
                </div>
                <textarea className="textarea" rows="3" placeholder="Notlar (opsiyonel)" value={form.notes} onChange={(e) => onChange("notes", e.target.value)} />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn btn-primary" onClick={submit}>Kaydet</button>
                </div>
            </div>

            {result && (
                <div className="card group">
                    <SectionTitle title="Kayıt Oluşturuldu" />
                    <div className="kv">
                        <div><span className="kv-k">ID</span><span className="kv-v">{result.id}</span></div>
                        <div><span className="kv-k">Ateş</span><span className="kv-v">{result.temperature ?? "-"}</span></div>
                        <div><span className="kv-k">Nabız</span><span className="kv-v">{result.pulse ?? "-"}</span></div>
                        <div><span className="kv-k">TA (B/K)</span><span className="kv-v">{result.bpHigh ?? "-"} / {result.bpLow ?? "-"}</span></div>
                        <div><span className="kv-k">Seviye</span><span className={`kv-v tag ${String(result.triageLevel).toLowerCase()}`}>{result.triageLevel}</span></div>
                    </div>

                    {result.suggestionsJson && (
                        <>
                            <h3 style={{ marginTop: 18 }}>Olası Hastalıklar</h3>
                            <ul className="callouts">
                                {JSON.parse(result.suggestionsJson).map((x, i) => (
                                    <li key={i}>
                                        <span className={`tag urg-${x.urgency_level}`}>Seviye {x.urgency_level}</span>
                                        <span>{x.reasoning}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TriageForm() {
    return (
        <ProtectedRoute allow={["NURSE"]}>
            <TriageFormInner />
        </ProtectedRoute>
    );
}
