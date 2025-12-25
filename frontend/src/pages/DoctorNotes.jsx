import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api';

const DoctorNotes = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [markDone, setMarkDone] = useState(true);

    const [form, setForm] = useState({
        diagnosis: '',
        secondaryDiagnosis: '',
        plan: '',
        prescription: '',
        labOrders: '',
        selectedLabOrders: [],
        followUpDate: '',
        followUpNotes: '',
        referralNeeded: false,
        referralDepartment: '',
        restDays: ''
    });
    const [labSearchTerm, setLabSearchTerm] = useState('');
    const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detail = await apiGet(`/appointments/${appointmentId}/detail`);
                setAppointment(detail);
                
                // Mevcut doktor notunu yükle (varsa)
                if (detail?.doctorNotes && detail.doctorNotes.length > 0) {
                    const latestNote = detail.doctorNotes[0];
                    const labOrdersArray = latestNote.labOrders 
                        ? latestNote.labOrders.split(',').map(s => s.trim()).filter(s => s)
                        : [];
                    
                    setForm({
                        diagnosis: latestNote.diagnosis || '',
                        secondaryDiagnosis: latestNote.secondaryDiagnosis || '',
                        plan: latestNote.plan || '',
                        prescription: latestNote.prescription || '',
                        labOrders: latestNote.labOrders || '',
                        selectedLabOrders: labOrdersArray,
                        followUpDate: latestNote.followUpDate || '',
                        followUpNotes: latestNote.followUpNotes || '',
                        referralNeeded: latestNote.referralNeeded || false,
                        referralDepartment: latestNote.referralDepartment || '',
                        restDays: latestNote.restDays?.toString() || ''
                    });
                }
            } catch (err) {
                console.error('Veriler yüklenemedi:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [appointmentId]);

    // Türkiye sağlık sistemine uygun laboratuvar testleri
    const labTests = [
        'Tam Kan Sayımı (Hemogram)',
        'Biyokimya (Glukoz, Üre, Kreatinin)',
        'Karaciğer Fonksiyon Testleri (ALT, AST, GGT)',
        'Lipid Profili',
        'Tiroid Fonksiyon Testleri (TSH, T3, T4)',
        'CRP (C-Reaktif Protein)',
        'Sedimantasyon',
        'İdrar Tahlili',
        'Dışkı Tahlili',
        'Kan Gazı',
        'Koagülasyon Testleri (PT, aPTT, INR)',
        'Troponin',
        'BNP (B-Tipi Natriüretik Peptid)',
        'D-Dimer',
        'Ferritin',
        'Vitamin D',
        'B12, Folik Asit',
        'HbA1c',
        'Kültür ve Antibiyogram',
        'Seroloji Testleri',
        'Hormon Testleri',
        'Elektrolitler (Na, K, Cl)',
        'Bilirubin (Total, Direkt)',
        'Albumin',
        'Protein Elektroforezi',
        'Tümör Markerları',
        'Kan Grubu ve Crossmatch',
        'Gebelik Testi (Beta-HCG)',
        'PSA (Prostat Spesifik Antijen)',
        'Romatoid Faktör (RF)',
        'Anti-CCP',
        'ANA (Antinükleer Antikor)',
        'Hepatit Serolojisi',
        'HIV Testi',
        'Tüberküloz Testleri',
        'EKG',
        'Ekokardiografi',
        'Akciğer Grafisi',
        'BT (Bilgisayarlı Tomografi)',
        'MR (Manyetik Rezonans)',
        'Ultrasonografi'
    ];

    // Türkiye sağlık sistemine uygun tıbbi bölümler
    const medicalDepartments = [
        'Acil Tıp',
        'Anesteziyoloji ve Reanimasyon',
        'Beyin ve Sinir Cerrahisi (Nöroşirurji)',
        'Çocuk Cerrahisi',
        'Çocuk Sağlığı ve Hastalıkları',
        'Dermatoloji',
        'Enfeksiyon Hastalıkları',
        'Fizik Tedavi ve Rehabilitasyon',
        'Genel Cerrahi',
        'Göğüs Cerrahisi',
        'Göğüs Hastalıkları',
        'Göz Hastalıkları',
        'İç Hastalıkları (Dahiliye)',
        'Kadın Hastalıkları ve Doğum',
        'Kalp ve Damar Cerrahisi',
        'Kardiyoloji',
        'Kulak Burun Boğaz',
        'Nöroloji',
        'Ortopedi ve Travmatoloji',
        'Plastik ve Rekonstrüktif Cerrahi',
        'Psikiyatri',
        'Radyoloji',
        'Üroloji',
        'Onkoloji',
        'Endokrinoloji',
        'Gastroenteroloji',
        'Nefroloji',
        'Romatoloji',
        'Hematoloji',
        'İmmünoloji ve Alerji',
        'Göğüs Hastalıkları ve Tüberküloz',
        'Nükleer Tıp',
        'Patoloji'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleLabOrderToggle = (labTest) => {
        const updated = form.selectedLabOrders.includes(labTest)
            ? form.selectedLabOrders.filter(t => t !== labTest)
            : [...form.selectedLabOrders, labTest];
        setForm({
            ...form,
            selectedLabOrders: updated,
            labOrders: updated.join(', ')
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.diagnosis.trim() || !form.plan.trim()) {
            alert('Tanı ve plan alanları zorunludur');
            return;
        }
        setSubmitting(true);
        try {
            await apiPost(`/doctor-notes?markDone=${markDone}`, {
                appointmentId: parseInt(appointmentId),
                diagnosis: form.diagnosis,
                secondaryDiagnosis: form.secondaryDiagnosis || null,
                plan: form.plan,
                prescription: form.prescription || null,
                labOrders: form.labOrders || null,
                followUpDate: form.followUpDate || null,
                followUpNotes: form.followUpNotes || null,
                referralNeeded: form.referralNeeded,
                referralDepartment: form.referralDepartment || null,
                restDays: form.restDays ? parseInt(form.restDays) : null
            });
            alert('Doktor notu kaydedildi!');
            navigate('/appointments');
        } catch (err) {
            alert('Hata: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const parseSuggestions = (jsonStr) => {
        if (!jsonStr) return [];
        try {
            return JSON.parse(jsonStr);
        } catch {
            return [];
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Yükleniyor...</p></div>;

    const latestTriage = appointment?.triageRecords?.[0];
    const suggestions = latestTriage?.suggestionsJson ? parseSuggestions(latestTriage.suggestionsJson) : [];

    return (
        <div className="form-page">
            <div className="form-header">
                <h1>✏️ Doktor Notu</h1>
                {appointment?.patient && (
                    <div className="patient-banner">
                        <span className="queue">#{appointment.appointment?.queueNumber}</span>
                        <span className="name">{appointment.patient.name}</span>
                        <span className="tc">TC: {appointment.patient.tc}</span>
                    </div>
                )}
            </div>

            {appointment?.triageRecords?.length > 0 && (
                <div className="triage-summary">
                    <h3>📋 Triaj Bilgileri</h3>
                    {appointment.triageRecords.map((tr, i) => (
                        <div key={i} className="triage-info">
                            <span className={`level ${tr.triageLevel?.toLowerCase()}`}>{tr.triageLevel}</span>
                            <span>Semptomlar: {tr.nurseSymptomsCsv}</span>
                            {tr.notes && <span>Not: {tr.notes}</span>}
                        </div>
                    ))}
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="form-section suggestions-section">
                    <div className="section-header">
                        <h3>📊 Veri Setinden Eşleşen Kayıtlar (Triaj'dan)</h3>
                        <span className="info-badge">Triyaj sırasında kaydedilen semptomlara göre</span>
                    </div>
                    <div className="suggestions-grid">
                        {suggestions.map((suggestion, idx) => {
                            const matchScore = suggestion.match_score || 0;
                            const reasoning = suggestion.reasoning || 'Açıklama mevcut değil';

                            return (
                                <div key={idx} className="suggestion-card">
                                    <div className="suggestion-header">
                                        <div className="suggestion-rank">#{idx + 1}</div>
                                        <div className="suggestion-score">Eşleşme: {matchScore}/{latestTriage?.nurseSymptomsCsv?.split(',').length || 0}</div>
                                    </div>
                                    <div className="suggestion-content">
                                        <p className="suggestion-text">{reasoning}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="doctor-form">
                <div className="form-section">
                    <h3>🩺 Tanı</h3>
                    <div className="form-group">
                        <label>Birincil Tanı *</label>
                        <input
                            type="text"
                            name="diagnosis"
                            value={form.diagnosis}
                            onChange={handleChange}
                            placeholder="Ana tanı"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>İkincil Tanı</label>
                        <input
                            type="text"
                            name="secondaryDiagnosis"
                            value={form.secondaryDiagnosis}
                            onChange={handleChange}
                            placeholder="Varsa ikincil tanı"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>📝 Tedavi Planı</h3>
                    <div className="form-group">
                        <label>Plan *</label>
                        <textarea
                            name="plan"
                            value={form.plan}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tedavi planı"
                            required
                            className="notes-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label>Reçete</label>
                        <textarea
                            name="prescription"
                            value={form.prescription}
                            onChange={handleChange}
                            rows="3"
                            placeholder="İlaçlar ve dozajları"
                            className="notes-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label>Laboratuvar İstemleri</label>
                        <div className="lab-orders-container">
                            <div className="lab-orders-search-wrapper">
                                <div className="lab-orders-search">
                                    <input
                                        type="text"
                                        placeholder="Test ara... (örn: kan, karaciğer, tiroid)"
                                        value={labSearchTerm}
                                        onChange={(e) => setLabSearchTerm(e.target.value)}
                                        className="lab-search-input"
                                    />
                                    {labSearchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setLabSearchTerm('')}
                                            className="search-clear-btn"
                                            aria-label="Temizle"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {labSearchTerm && (
                                    <div className="lab-orders-dropdown">
                                        {labTests
                                            .filter(test => 
                                                test.toLowerCase().includes(labSearchTerm.toLowerCase())
                                            )
                                            .map((test, idx) => {
                                                const isSelected = form.selectedLabOrders.includes(test);
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`lab-order-option ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => handleLabOrderToggle(test)}
                                                    >
                                                        <div className="lab-order-checkbox-wrapper">
                                                            <div className={`lab-order-checkbox-custom ${isSelected ? 'checked' : ''}`}>
                                                                {isSelected && (
                                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="lab-order-text">{test}</span>
                                                    </div>
                                                );
                                            })}
                                        {labTests.filter(test => 
                                            test.toLowerCase().includes(labSearchTerm.toLowerCase())
                                        ).length === 0 && (
                                            <div className="lab-orders-empty">
                                                <span className="empty-icon">🔍</span>
                                                <p>"{labSearchTerm}" için sonuç bulunamadı</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {form.selectedLabOrders.length > 0 && (
                                <div className="selected-lab-orders">
                                    <div className="selected-tags">
                                        {form.selectedLabOrders.map((test, idx) => (
                                            <span key={idx} className="selected-tag">
                                                <span className="tag-text">{test}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleLabOrderToggle(test)}
                                                    className="tag-remove"
                                                    aria-label="Kaldır"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>📅 Takip</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Kontrol Tarihi</label>
                            <input
                                type="date"
                                name="followUpDate"
                                value={form.followUpDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>İstirahat (gün)</label>
                            <input
                                type="number"
                                name="restDays"
                                value={form.restDays}
                                onChange={handleChange}
                                min="0"
                                max="365"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Takip Notları</label>
                        <textarea
                            name="followUpNotes"
                            value={form.followUpNotes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Kontrol için notlar"
                            className="notes-textarea"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>🔄 Sevk</h3>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="referralNeeded"
                                checked={form.referralNeeded}
                                onChange={handleChange}
                            />
                            Sevk gerekli
                        </label>
                    </div>
                    {form.referralNeeded && (
                        <div className="form-group">
                            <label>Sevk Edilecek Bölüm</label>
                            <div className="department-search-wrapper">
                                <div className="department-search">
                                    <input
                                        type="text"
                                        placeholder={form.referralDepartment || "Bölüm ara... (örn: kardiyoloji, nöroloji)"}
                                        value={departmentSearchTerm}
                                        onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                                        className="department-search-input"
                                        onFocus={() => {
                                            if (form.referralDepartment && !departmentSearchTerm) {
                                                setDepartmentSearchTerm(form.referralDepartment);
                                            }
                                        }}
                                    />
                                    {(departmentSearchTerm || form.referralDepartment) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDepartmentSearchTerm('');
                                                setForm({ ...form, referralDepartment: '' });
                                            }}
                                            className="search-clear-btn"
                                            aria-label="Temizle"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                {departmentSearchTerm && (
                                    <div className="department-dropdown">
                                        {medicalDepartments
                                            .filter(dept => 
                                                dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
                                            )
                                            .map((dept, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`department-option ${form.referralDepartment === dept ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setForm({ ...form, referralDepartment: dept });
                                                        setDepartmentSearchTerm('');
                                                    }}
                                                >
                                                    {dept}
                                                    {form.referralDepartment === dept && (
                                                        <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                        {medicalDepartments.filter(dept => 
                                            dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
                                        ).length === 0 && (
                                            <div className="department-empty">
                                                <span className="empty-icon">🔍</span>
                                                <p>"{departmentSearchTerm}" için sonuç bulunamadı</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {form.referralDepartment && !departmentSearchTerm && (
                                    <div className="selected-department">
                                        <span className="selected-dept-badge">
                                            <span className="dept-icon">🏥</span>
                                            <span className="dept-name">{form.referralDepartment}</span>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, referralDepartment: '' })}
                                                className="dept-remove"
                                                aria-label="Kaldır"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={markDone}
                                onChange={(e) => setMarkDone(e.target.checked)}
                            />
                            Muayeneyi tamamla
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/appointments')} className="btn-cancel">
                        İptal
                    </button>
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorNotes;
