package com.acil.er_backend.service;

import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.AppointmentStatus;

import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    // !!! Artık symptomsCsv yok
    Appointment createAppointment(Long patientId);

    Optional<Appointment> findTodayActiveByTc(String tc);

    long countWaitingAheadFor(Appointment appointment);

    List<Appointment> listToday();

    List<Appointment> listTodayByStatus(AppointmentStatus status);

    Appointment updateStatus(Long appointmentId, AppointmentStatus newStatus);

    void deleteAppointment(Long appointmentId);
}
