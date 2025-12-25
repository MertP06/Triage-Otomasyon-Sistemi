# 🏥 Hastane Acil Servis Yönetim Sistemi

Modern ve kullanıcı dostu bir hastane acil servis yönetim sistemi. Backend (Spring Boot), Frontend (React) ve Mobil (Flutter) uygulamalarından oluşan tam kapsamlı bir sistem.

## 📋 Özellikler

### Hasta Yönetimi
- TC kimlik no ile hasta kaydı
- Hasta geçmişi görüntüleme
- Randevu oluşturma

### Triaj Sistemi
- AI destekli semptom analizi
- Vital bulgu kaydı
- Triaj seviyesi belirleme (Kırmızı/Sarı/Yeşil)
- Mobil uygulama üzerinden hasta triaj kaydı

### Doktor Modülü
- Muayene ve tanı girişi
- Reçete yazma
- Laboratuvar istemi
- Sevk işlemleri

### Bekleme Odası Ekranı
- Gerçek zamanlı sıra takibi
- Çağrılan hasta gösterimi
- Otomatik güncelleme

### Dashboard
- Günlük istatistikler
- Triaj dağılımı
- Ortalama bekleme süresi

## 🚀 Kurulum

### Gereksinimler

**Backend:**
- Java 17 veya üzeri
- PostgreSQL 14 veya üzeri
- Gradle (wrapper ile birlikte gelir)

**Frontend:**
- Node.js 18 veya üzeri
- npm veya yarn

**Mobil:**
- Flutter SDK 3.3.0 veya üzeri
- Dart SDK
- Android Studio (Android geliştirme için)
- Xcode (iOS geliştirme için, sadece macOS)

### 1. Projeyi Klonlama

```bash
git clone <repository-url>
cd hospital_er
```

### 2. Veritabanı Kurulumu

PostgreSQL'de veritabanı oluşturun:

```sql
CREATE DATABASE hospital_er;
```

**Varsayılan Bağlantı Bilgileri:**
- Host: `localhost:5432`
- Database: `hospital_er`
- Username: `postgres`
- Password: `1234`

> **Not:** Veritabanı bağlantı bilgilerini `backend/er-backend/src/main/resources/application.properties` dosyasından değiştirebilirsiniz.

### 3. Backend Kurulumu ve Çalıştırma

```bash
cd backend/er-backend

# Windows için
gradlew.bat bootRun

# Linux/Mac için
./gradlew bootRun
```

**Alternatif (IntelliJ IDEA):**
1. Projeyi IntelliJ IDEA'da açın
2. `ErBackendApplication.java` dosyasını bulun
3. Sağ tıklayıp `Run 'ErBackendApplication'` seçeneğini seçin

**Backend Varsayılan Port:** `8080`  
**API Base URL:** `http://localhost:8080/api`

### 4. Frontend Kurulumu ve Çalıştırma

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

**Frontend Varsayılan Port:** `5173`  
**URL:** `http://localhost:5173`

> **Not:** API adresini değiştirmek için `frontend/.env` dosyası oluşturun ve `VITE_API_BASE=http://localhost:8080/api` ekleyin.

### 5. Mobil Uygulama (Flutter) Kurulumu ve Çalıştırma

#### Flutter SDK Kurulumu

Flutter SDK'nın kurulu olduğundan emin olun:

```bash
flutter --version
```

Kurulu değilse: [Flutter Kurulum Rehberi](https://docs.flutter.dev/get-started/install)

#### Bağımlılıkları Yükleme

```bash
cd mobil
flutter pub get
```

#### Uygulamayı Çalıştırma

**Web (Chrome) için:**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080/api
```

**Android Emulator için:**
```bash
# Önce bir Android emulator başlatın, sonra:
flutter run -d android --dart-define=API_BASE_URL=http://10.0.2.2:8080/api
```

**iOS Simulator için (sadece macOS):**
```bash
# Önce bir iOS simulator başlatın, sonra:
flutter run -d ios --dart-define=API_BASE_URL=http://localhost:8080/api
```

**Fiziksel Cihaz için:**
- Android: Bilgisayarınızın IP adresini kullanın (örn: `http://192.168.1.100:8080/api`)
- iOS: Bilgisayarınızın IP adresini kullanın

#### API Adresi Notları

| Platform | API Base URL |
|----------|-------------|
| Web (Chrome) | `http://localhost:8080/api` |
| Android Emulator | `http://10.0.2.2:8080/api` |
| iOS Simulator | `http://localhost:8080/api` |
| Fiziksel Cihaz | `http://[BILGISAYAR_IP]:8080/api` |

> **Önemli:** Backend'in çalıştığından emin olun. Mobil uygulama backend'e bağlanamazsa hata verecektir.

## 🔑 Giriş Bilgileri

### Web Uygulaması (Frontend)

| Rol | Kullanıcı Adı | Şifre |
|-----|---------------|-------|
| Triyaj Sorumlusu | `triyaj` | `triyaj123` |
| Doktor | `doctor` | `doctor123` |

### Mobil Uygulama

**İlk Kullanım:**
1. Uygulamayı açın
2. "Hasta Kaydı" seçeneğini seçin
3. TC Kimlik No, İsim, Doğum Yılı ve Cinsiyet bilgilerini girin
4. Kayıt oluşturun

**Sonraki Girişler:**
1. "Hasta Girişi" seçeneğini seçin
2. TC Kimlik No ve İsim ile giriş yapın

## 📡 API Endpoints

### Hastalar
- `GET /api/patients` - Tüm hastaları listele
- `POST /api/patients` - Yeni hasta oluştur
- `GET /api/patients/{tc}` - TC kimlik no ile hasta detayı

### Mobil Hasta İşlemleri
- `POST /api/mobile/patient/register` - Mobil hasta kaydı
- `POST /api/mobile/patient/login` - Mobil hasta girişi

### Randevular
- `GET /api/appointments` - Günün randevularını listele
- `POST /api/appointments` - Yeni randevu oluştur
- `PATCH /api/appointments/{id}/status` - Randevu durumunu güncelle
- `GET /api/appointments/history/{tc}` - Hasta geçmişi
- `GET /api/appointments/dashboard` - Dashboard istatistikleri
- `GET /api/appointments/waiting-room` - Bekleme odası listesi
- `GET /api/appointments/mobile/queue/{tc}` - Mobil sıra durumu sorgulama

### Triaj
- `POST /api/triage` - Triaj kaydı oluştur (Web)
- `POST /api/mobile/triage` - Mobil triaj kaydı (otomatik randevu oluşturur)
- `GET /api/triage/by-appointment/{id}` - Randevuya göre triaj kayıtları

### Doktor Notları
- `POST /api/doctor-notes` - Doktor notu oluştur
- `GET /api/doctor-notes/by-appointment/{id}` - Randevuya göre doktor notları

## 🛠 Teknolojiler

### Backend
- **Spring Boot 3.2** - Java framework
- **Spring Security** - Güvenlik ve kimlik doğrulama
- **Spring Data JPA** - Veritabanı erişimi
- **PostgreSQL** - İlişkisel veritabanı
- **Gradle** - Build tool

### Frontend
- **React 18** - UI kütüphanesi
- **React Router** - Sayfa yönlendirme
- **Vite** - Build tool ve dev server
- **Axios** - HTTP client

### Mobil
- **Flutter 3.3+** - Cross-platform framework
- **Dart** - Programlama dili
- **Dio** - HTTP client
- **Shared Preferences** - Yerel veri depolama

## 📱 Mobil Uygulama Detayları

### Özellikler
- ✅ Hasta kayıt/giriş sistemi (TC + İsim)
- ✅ Kategorize edilmiş semptom seçimi
- ✅ Semptom arama özelliği
- ✅ Otomatik triaj seviyesi belirleme
- ✅ Gerçek zamanlı kuyruk durumu sorgulama
- ✅ Aciliyet seviyesi görsel gösterimi (Kırmızı/Sarı/Yeşil)
- ✅ Modern Material Design 3 arayüz
- ✅ T.C. Kimlik No validasyonu
- ✅ Form validasyonları

### Proje Yapısı

```
mobil/
├── lib/
│   ├── constants/          # Sabitler (renkler, stringler)
│   ├── models/             # Veri modelleri
│   ├── pages/              # UI sayfaları
│   ├── services/           # API ve depolama servisleri
│   └── utils/              # Yardımcı fonksiyonlar
├── assets/                 # JSON veri dosyaları
└── pubspec.yaml           # Bağımlılıklar
```

### Hızlı Başlangıç Senaryosu

1. **Backend'i başlatın:**
   ```bash
   cd backend/er-backend
   ./gradlew bootRun
   ```

2. **Mobil uygulamayı başlatın:**
   ```bash
   cd mobil
   flutter pub get
   flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080/api
   ```

3. **Test akışı:**
   - Hasta kaydı oluşturun (TC, İsim, Doğum Yılı, Cinsiyet)
   - Semptom seçin ve triaj kaydı oluşturun
   - Aciliyet seviyesi ve sıra numarasını görüntüleyin
   - Kuyruk durumunu güncelleyin

## 📁 Proje Yapısı

```
hospital_er/
├── backend/
│   └── er-backend/         # Spring Boot backend
├── frontend/               # React frontend
├── mobil/                  # Flutter mobil uygulama
└── dataset/                # Örnek veri dosyaları
```

## 🧪 Test

### Backend Test
```bash
cd backend/er-backend
./gradlew test
```

### Frontend Test
```bash
cd frontend
npm test
```

### Flutter Test
```bash
cd mobil
flutter test
```

## 🐛 Sorun Giderme

### Backend başlamıyor
- PostgreSQL servisinin çalıştığından emin olun
- Veritabanı bağlantı bilgilerini kontrol edin
- Port 8080'in kullanılabilir olduğundan emin olun

### Frontend API'ye bağlanamıyor
- Backend'in çalıştığından emin olun
- `.env` dosyasında `VITE_API_BASE` değerini kontrol edin
- CORS ayarlarını kontrol edin

### Flutter uygulaması çalışmıyor
- Flutter SDK'nın kurulu olduğundan emin olun: `flutter doctor`
- Bağımlılıkları yükleyin: `flutter pub get`
- API adresinin doğru olduğundan emin olun (platforma göre değişir)
- Backend'in çalıştığından emin olun

### Android Emulator API bağlantı sorunu
- Android emulator için `10.0.2.2` adresini kullanın
- Emulator'ün internet bağlantısı olduğundan emin olun

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Geliştiriciler

Bu proje eğitim amaçlı geliştirilmiştir.

---

**Not:** Bu sistem demo amaçlıdır ve gerçek tıbbi kararlar için kullanılmamalıdır.
