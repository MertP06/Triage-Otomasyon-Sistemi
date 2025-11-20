package com.acil.er_backend.repository;

import com.acil.er_backend.model.TriageRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TriageRecordRepository extends JpaRepository<TriageRecord, Long> {

    // Appointment entity’sinin ID’sine göre filtrele
    List<TriageRecord> findByAppointment_IdOrderByCreatedAtDesc(Long appointmentId);
}
