import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary colors (aligned with web palette)
  static const Color primary = Color(0xFF6366F1);
  static const Color primaryDark = Color(0xFF4F46E5);
  static const Color primaryLight = Color(0xFF818CF8);

  // Background colors
  static const Color background = Color(0xFFF1F4FF);
  static const Color surface = Colors.white;
  static const Color surfaceVariant = Color(0xFFF8FAFF);

  // Text colors
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF666666);
  static const Color textTertiary = Color(0xFF999999);

  // Urgency colors
  static const Color urgencyCritical = Color(0xFFE53935); // ACIL - Kırmızı
  static const Color urgencyHigh = Color(0xFFFF9800); // ÖNCELİKLİ - Turuncu
  static const Color urgencyNormal = Color(0xFF4CAF50); // NORMAL - Yeşil
  static const Color urgencyUnknown = Color(0xFF9E9E9E); // BELİRSİZ - Gri

  // Status colors
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFE53935);
  static const Color info = Color(0xFF2196F3);

  // Border colors
  static const Color border = Color(0xFFE0E0E0);
  static const Color borderLight = Color(0xFFF0F0F0);
}

