import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/patient.dart';

class StorageService {
  static const _kLastPatientKey = "last_patient";
  static const _kPatientHistoryKey = "patient_history";
  static const _kMaxHistorySize = 50; // Maximum number of patients to keep in history
  static const _kAuthPatientKey = "auth_patient";
  static const _kNotifyPrefKey = "notify_on_update";

  /// Save the last registered patient
  static Future<void> saveLastPatient(Patient p) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final patientWithTimestamp = p.copyWith(createdAt: DateTime.now());
      await prefs.setString(_kLastPatientKey, jsonEncode(patientWithTimestamp.toJson()));
      
      // Also add to history
      await _addToHistory(patientWithTimestamp);
    } catch (e) {
      throw Exception('Hasta kaydedilirken hata oluştu: $e');
    }
  }

  /// Get the last registered patient
  static Future<Patient?> getLastPatient() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_kLastPatientKey);
      if (str == null) return null;
      
      final json = jsonDecode(str) as Map<String, dynamic>;
      return Patient.fromJson(json);
    } catch (e) {
      return null;
    }
  }

  /// Add patient to history
  static Future<void> _addToHistory(Patient p) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyJson = prefs.getString(_kPatientHistoryKey);
      
      List<Map<String, dynamic>> history = [];
      if (historyJson != null) {
        final list = jsonDecode(historyJson) as List;
        history = list.cast<Map<String, dynamic>>();
      }
      
      // Add new patient at the beginning
      history.insert(0, p.toJson());
      
      // Keep only the last N patients
      if (history.length > _kMaxHistorySize) {
        history = history.sublist(0, _kMaxHistorySize);
      }
      
      await prefs.setString(_kPatientHistoryKey, jsonEncode(history));
    } catch (e) {
      // Silently fail - history is not critical
    }
  }

  /// Get patient history
  static Future<List<Patient>> getPatientHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyJson = prefs.getString(_kPatientHistoryKey);
      
      if (historyJson == null) return [];
      
      final list = jsonDecode(historyJson) as List;
      return list
          .map((e) => Patient.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Clear all stored data
  static Future<void> clear() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_kLastPatientKey);
      await prefs.remove(_kPatientHistoryKey);
      await prefs.remove(_kAuthPatientKey);
    } catch (e) {
      throw Exception('Veriler temizlenirken hata oluştu: $e');
    }
  }

  /// Clear only history
  static Future<void> clearHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_kPatientHistoryKey);
    } catch (e) {
      throw Exception('Geçmiş temizlenirken hata oluştu: $e');
    }
  }

  /// Save authenticated patient profile
  static Future<void> saveAuthPatient(Patient p) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kAuthPatientKey, jsonEncode(p.toJson()));
  }

  /// Get authenticated patient profile
  static Future<Patient?> getAuthPatient() async {
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString(_kAuthPatientKey);
    if (str == null) return null;
    try {
      final json = jsonDecode(str) as Map<String, dynamic>;
      return Patient.fromJson(json);
    } catch (_) {
      return null;
    }
  }

  static Future<void> clearAuthPatient() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kAuthPatientKey);
  }

  static Future<void> saveNotifyPreference(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kNotifyPrefKey, enabled);
  }

  static Future<bool> getNotifyPreference() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_kNotifyPrefKey) ?? true;
  }
}
