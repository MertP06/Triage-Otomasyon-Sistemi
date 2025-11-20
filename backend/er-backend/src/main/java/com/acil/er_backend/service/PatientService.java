package com.acil.er_backend.service;

import com.acil.er_backend.model.Patient;

import java.util.List;

/**
 * Patient (Hasta) ile ilgili iş mantığı operasyonlarını tanımlar.
 * Uygulama mantığının implementasyonu PatientServiceImpl sınıfında yapılır.
 */
public interface PatientService {

    // Yeni hasta kaydet
    Patient savePatient(Patient patient);

    // Tüm hastaları listele
    List<Patient> getAllPatients();

    // ID ile hasta getir (yoksa null döner)
    Patient getPatientById(Long id);

    // Hasta sil
    void deletePatient(Long id);

    // Belirli bir TC numarasına sahip hasta var mı kontrol et
    boolean existsByTc(String tc);

    // Tam güncelleme (PUT) — tüm alanlar set edilir
    Patient updatePatient(Long id, Patient updated);

    // Kısmi güncelleme (PATCH) — sadece dolu gelen alanlar set edilir
    Patient partialUpdatePatient(Long id, Patient patch);
}
