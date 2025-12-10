class AppStrings {
  AppStrings._();

  // App
  static const String appName = 'Acil Triage - Hasta';
  static const String appTitle = 'Geçmiş Olsun';

  // Home Page
  static const String patientRegistration = 'Hasta Kayıt';
  static const String triageResult = 'Triage Sonucu';
  static const String patientCard = 'Hasta Kartı Görüntüle';

  // Register Page
  static const String registerTitle = 'Hasta Kayıt';
  static const String fullName = 'Ad Soyad';
  static const String nationalId = 'T.C. Kimlik No';
  static const String createRecord = 'Kaydı Oluştur';
  static const String searchSymptom = 'Semptom ara...';
  static const String clearSelections = 'Seçimleri Temizle';
  static const String selected = 'Seçili';
  static const String selectAll = 'Tümünü Seç';
  static const String clear = 'Temizle';
  static const String itemsCount = 'Öğe sayısı';
  static const String more = 'daha';

  // Validation
  static const String enterValidName = 'Geçerli bir ad giriniz';
  static const String enterValidTc = '11 haneli T.C. giriniz';
  static const String selectAtLeastOneSymptom = 'Lütfen en az bir semptom seçiniz.';
  static const String invalidTcFormat = 'T.C. Kimlik No sadece rakam içermelidir';

  // Triage Result Page
  static const String triageResultTitle = 'Triage Sonucu';
  static const String noRecordYet = 'Henüz bir kayıt yok.';
  static const String symptoms = 'Semptomlar';
  static const String urgency = 'Aciliyet';
  static const String queueNumber = 'Sıra Numaranız';
  static const String estimatedWait = 'Tahmini bekleme';
  static const String minutes = 'dakika';
  static const String triageFinishedTitle = 'Triaj tamamlandı';
  static const String triageFinishedDesc =
      'Değerlendirme süreci bitti. Lütfen çağrı ekranını ve bildirimleri takip edin.';
  static const String createdAt = 'Kayıt zamanı';

  // Patient Card Page
  static const String patientCardTitle = 'Hasta Kartı';
  static const String recordNotFound = 'Kayıt bulunamadı.';

  // Urgency Labels
  static const String urgencyCritical = 'ACIL';
  static const String urgencyHigh = 'ÖNCELİKLİ';
  static const String urgencyNormal = 'NORMAL';
  static const String urgencyUnknown = 'BELİRSİZ';
  static const String evaluationRequired = 'DEĞERLENDİRME GEREKLI';

  // Errors
  static const String errorLoadingSymptoms = 'Semptom listesi yüklenemedi.';
  static const String errorLoadingCategories = 'Kategori yükleme hatası';
  static const String errorOccurred = 'Bir hata oluştu';
  static const String defaultResponse = 'Belirtileriniz için acil servise başvurunuz.';
}

