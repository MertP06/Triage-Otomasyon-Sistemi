package com.acil.er_backend.repository;

import com.acil.er_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Patient (Hasta) varlığı için CRUD işlemlerini gerçekleştiren arayüz.
 * JpaRepository sayesinde SQL sorgusu yazmadan çoğu işlemi halledebiliriz.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Belirli bir TC numarasına sahip hasta veritabanında var mı?
     * @param tc hastanın Türkiye Cumhuriyeti kimlik numarası
     * @return true -> varsa, false -> yoksa
     */
    boolean existsByTc(String tc);
}
