class Validators {
  Validators._();

  /// Validates Turkish National ID (TC Kimlik No)
  /// Only checks 11 digits and numeric content (checksum yok)
  static String? validateTcKimlikNo(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'T.C. Kimlik No boş olamaz';
    }

    final trimmed = value.trim();

    if (trimmed.length != 11) {
      return 'T.C. Kimlik No 11 haneli olmalıdır';
    }

    if (!RegExp(r'^\d+$').hasMatch(trimmed)) {
      return 'T.C. Kimlik No sadece rakam içermelidir';
    }

    if (trimmed[0] == '0') {
      return 'T.C. Kimlik No 0 ile başlayamaz';
    }

    return null;
  }

  /// Validates full name
  static String? validateFullName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Ad Soyad boş olamaz';
    }

    final trimmed = value.trim();

    if (trimmed.length < 2) {
      return 'Ad Soyad en az 2 karakter olmalıdır';
    }

    if (trimmed.length > 100) {
      return 'Ad Soyad çok uzun';
    }

    // Should contain at least one space (name and surname)
    if (!trimmed.contains(' ')) {
      return 'Lütfen ad ve soyadınızı giriniz';
    }

    // Should only contain letters, spaces, and Turkish characters
    if (!RegExp(r'^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$').hasMatch(trimmed)) {
      return 'Ad Soyad sadece harf içermelidir';
    }

    return null;
  }
}

