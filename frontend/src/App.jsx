import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Appointments from "./pages/Appointments";
import TriageForm from "./pages/TriageForm";
import DoctorNotes from "./pages/DoctorNotes";
import AppointmentDetail from "./pages/AppointmentDetail";
import Login from "./pages/Login";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isLogin = pathname === "/login";

  // Henüz localStorage kontrolü yapılmadıysa
  if (user === null) {
    return (
      <div className="container" style={{ marginTop: 100 }}>
        <div className="card">
          <h2>Oturum yükleniyor...</h2>
          <p className="muted">Lütfen bekleyin, bilgiler kontrol ediliyor.</p>
        </div>
      </div>
    );
  }

  // Kullanıcı yoksa ve login sayfasında değilse → login’e yönlendir
  if (user === false && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Kullanıcı giriş yaptıysa üst menü görünür */}
      {!isLogin && user && user !== false && <NavBar />}

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={user && user !== false ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Tüm randevular */}
        <Route
          path="/"
          element={
            <ProtectedRoute allow={["NURSE", "DOCTOR"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        {/* Hemşire için triage formu */}
        <Route
          path="/triage"
          element={
            <ProtectedRoute allow={["NURSE"]}>
              <TriageForm />
            </ProtectedRoute>
          }
        />

        {/* Doktor notu sayfası */}
        <Route
          path="/doctor-notes"
          element={
            <ProtectedRoute allow={["DOCTOR"]}>
              <DoctorNotes />
            </ProtectedRoute>
          }
        />

        {/* Randevu detay sayfası */}
        <Route
          path="/detail"
          element={
            <ProtectedRoute allow={["NURSE", "DOCTOR"]}>
              <AppointmentDetail />
            </ProtectedRoute>
          }
        />

        {/* Diğer tüm rotalar */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}
