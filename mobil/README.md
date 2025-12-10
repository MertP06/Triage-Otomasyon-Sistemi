# Acil Triage - Hasta Mobil Uygulaması

Acil servis triage (önceliklendirme) sistemi için geliştirilmiş Flutter mobil uygulaması. Hasta kayıt işlemlerini yönetir ve semptomlara göre aciliyet seviyesi belirler.

## 🎯 Özellikler

- **Hasta Kayıt**: Ad, soyad, T.C. Kimlik No ve semptom seçimi ile hasta kaydı
- **Triage Sistemi**: Seçilen semptomlara göre otomatik aciliyet seviyesi belirleme
- **Semptom Kategorileri**: Kategorize edilmiş semptom listesi ile kolay seçim
- **Semptom Arama**: Hızlı semptom arama özelliği
- **Hasta Kartı**: Kayıtlı hasta bilgilerini görüntüleme
- **Triage Sonuçları**: Aciliyet seviyesi, sıra numarası ve tahmini bekleme süresi

## 📱 Ekranlar

### Ana Sayfa
- Hasta kayıt, triage sonucu ve hasta kartı görüntüleme seçenekleri

### Hasta Kayıt
- Kişisel bilgiler (Ad Soyad, T.C. Kimlik No)
- Kategorize edilmiş semptom seçimi
- Semptom arama özelliği
- Toplu seçim/temizleme işlemleri

### Triage Sonucu
- Aciliyet seviyesi (ACIL, ÖNCELİKLİ, NORMAL)
- Sıra numarası
- Tahmini bekleme süresi
- Semptom listesi
- Tıbbi açıklama ve öneriler

### Hasta Kartı
- Hasta bilgileri
- Aciliyet durumu
- Semptom listesi
- Kayıt tarihi ve saati

## 🏗️ Proje Yapısı

```
lib/
├── constants/
│   ├── app_colors.dart      # Uygulama renkleri
│   └── app_strings.dart     # String sabitleri
├── models/
│   ├── patient.dart         # Hasta modeli
│   └── triage_rule.dart     # Triage kuralı modeli
├── pages/
│   ├── home_page.dart       # Ana sayfa
│   ├── register_page.dart   # Hasta kayıt sayfası
│   ├── triage_result_page.dart  # Triage sonuç sayfası
│   └── patient_card_page.dart   # Hasta kartı sayfası
├── services/
│   ├── storage_service.dart    # Yerel depolama servisi
│   └── triage_service.dart     # Triage işlem servisi
├── utils/
│   ├── validators.dart         # Form validasyonları
│   └── urgency_helper.dart     # Aciliyet yardımcı fonksiyonları
└── main.dart                   # Uygulama giriş noktası
```

## 🚀 Kurulum

### Gereksinimler
- Flutter SDK (>=3.3.0)
- Dart SDK
- Android Studio / Xcode (platform bağımlı geliştirme için)

### Adımlar

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd hospital_er/mobil
```

2. Bağımlılıkları yükleyin:
```bash
flutter pub get
```

3. Uygulamayı çalıştırın:
```bash
flutter run
```

### API Adresi

- Varsayılan: `http://10.0.2.2:8080/api` (Android emulator)
- Farklı ortamlar için: `--dart-define=API_BASE_URL=https://sunucu-adresi/api`
- Endpoint: `POST /api/mobile/triage` (kayıt + aciliyet yanıtı), `GET /api/appointments/mobile/queue/{tc}`

### Hızlı Test Senaryosu
1. Backend `./gradlew bootRun` ile ayakta, `hospital_er` veritabanı hazır olsun.
2. Mobilde formu doldur, semptom seç ve gönder: aciliyet, sıra, ETA dönmeli.
3. Sonuç ekranında `Sırayı Güncelle` ile çağrı/WAITING durumunu yenile; `CALLED` olursa üstte uyarı bandı gösterilir.

## 📦 Bağımlılıklar

- `flutter`: Flutter SDK
- `shared_preferences: ^2.2.2`: Yerel veri depolama
- `cupertino_icons: ^1.0.8`: iOS ikonları

## 🔧 Özellikler ve İyileştirmeler

### Kod Kalitesi
- ✅ Null safety desteği
- ✅ Hata yönetimi (error handling)
- ✅ Form validasyonları (T.C. Kimlik No, Ad Soyad)
- ✅ Merkezi renk ve string yönetimi
- ✅ Temiz kod prensipleri

### UI/UX
- ✅ Modern Material Design 3
- ✅ Responsive tasarım
- ✅ Görsel geri bildirimler
- ✅ Loading ve error state'leri
- ✅ Renk kodlu aciliyet gösterimi
- ✅ İkon ve görsel iyileştirmeleri

### Mimari
- ✅ Singleton pattern (servisler için)
- ✅ Separation of concerns
- ✅ Constants ve utilities ayrımı
- ✅ Model yönetimi (toJson/fromJson)

## 📊 Veri Yapısı

### Patient Model
```dart
{
  "fullName": String,
  "nationalId": String,
  "symptoms": List<String>,
  "queueNumber": int,
  "urgencyLabel": String,  // ACIL, ÖNCELİKLİ, NORMAL
  "urgencyLevel": int,     // 1-3
  "responseText": String,
  "createdAt": DateTime?
}
```

### Triage Rule
Semptomlara göre aciliyet seviyesi belirleme kuralları `assets/medical_data.json` dosyasında saklanır.

## 🎨 Tema ve Renkler

Uygulama merkezi renk yönetimi kullanır:
- **Primary**: `#26B4E3` (Mavi)
- **Urgency Critical**: `#E53935` (Kırmızı - ACIL)
- **Urgency High**: `#FF9800` (Turuncu - ÖNCELİKLİ)
- **Urgency Normal**: `#4CAF50` (Yeşil - NORMAL)

## 🔐 Validasyonlar

### T.C. Kimlik No
- 11 haneli olmalı
- Sadece rakam içermeli
- 0 ile başlayamaz
- Checksum algoritması kontrolü

### Ad Soyad
- En az 2 karakter
- Ad ve soyad arasında boşluk olmalı
- Sadece harf içermeli (Türkçe karakterler dahil)

## 📝 Notlar

- Sıra numarası şu anda örnek/statik bir değerdir
- Backend entegrasyonu için hazır yapı mevcuttur
- Hasta geçmişi özelliği StorageService'de mevcuttur (UI'da henüz kullanılmıyor)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Flutter ile geliştirilmiş acil servis triage uygulaması.

---

**Not**: Bu uygulama demo amaçlıdır ve gerçek tıbbi kararlar için kullanılmamalıdır.
