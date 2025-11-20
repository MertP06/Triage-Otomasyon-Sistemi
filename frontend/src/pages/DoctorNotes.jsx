import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiPost } from "../api";
import ProtectedRoute from "../components/ProtectedRoute";

function DoctorNotesInner() {
    const { user } = useAuth();
    const [appointmentId, setAppointmentId] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [plan, setPlan] = useState("");
    const [result, setResult] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const data = await apiPost("/api/doctor-notes", {
                appointmentId: Number(appointmentId || 0),
                diagnosis,
                plan
            }, user);
            setResult(data);
        } catch (e2) {
            console.error(e2);
            alert("Not eklenemedi (rolünüz DOCTOR olmalı).");
        }
    };

    return (
        <div className="container" style={{ marginTop: 20 }}>
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Doktor Notu</h2>
                <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                    <input
                        className="input"
                        placeholder="Randevu ID"
                        value={appointmentId}
                        onChange={e => setAppointmentId(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="Tanı (Diagnosis)"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                    />
                    <textarea
                        className="textarea"
                        rows="3"
                        placeholder="Plan"
                        value={plan}
                        onChange={e => setPlan(e.target.value)}
                    />
                    <div>
                        <button className="btn btn-primary">Kaydet</button>
                    </div>
                </form>
            </div>

            {result && (
                <div className="card" style={{ marginTop: 16 }}>
                    <h3 style={{ marginTop: 0 }}>Oluşturuldu</h3>
                    <div className="doctor-note-result">
                        <p><strong>ID:</strong> {result.id}</p>
                        <p><strong>Tanı:</strong> {result.diagnosis}</p>
                        <p><strong>Plan:</strong> {result.plan}</p>
                        <p><strong>Oluşturulma:</strong> {new Date(result.createdAt).toLocaleString("tr-TR")}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DoctorNotes() {
    return (
        <ProtectedRoute allow={["DOCTOR"]}>
            <DoctorNotesInner />
        </ProtectedRoute>
    );
}
