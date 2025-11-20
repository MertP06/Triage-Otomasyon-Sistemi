package com.acil.er_backend.repository;

import com.acil.er_backend.model.DoctorNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorNoteRepository extends JpaRepository<DoctorNote, Long> {
    List<DoctorNote> findByAppointment_IdOrderByCreatedAtDesc(Long appointmentId);
}
