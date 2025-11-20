package com.acil.er_backend.service;

import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.AppointmentStatus;
import com.acil.er_backend.model.Patient;
import com.acil.er_backend.repository.AppointmentRepository;
import com.acil.er_backend.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    @Transactional
    public Appointment createAppointment(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new NoSuchElementException("Hasta bulunamadı: id=" + patientId));

        LocalDate today = LocalDate.now();
        int maxQueue = appointmentRepository.findTodayMaxQueueNumber(today);
        int nextQueue = maxQueue + 1;

        Appointment ap = new Appointment();
        ap.setPatient(patient);
        ap.setQueueNumber(nextQueue);
        ap.setAppointmentDate(today);
        ap.setStatus(AppointmentStatus.WAITING);

        return appointmentRepository.save(ap);
    }

    @Override
    public Optional<Appointment> findTodayActiveByTc(String tc) {
        return appointmentRepository.findTodayActiveByTc(tc, LocalDate.now());
    }

    @Override
    public long countWaitingAheadFor(Appointment appointment) {
        return appointmentRepository.countWaitingAhead(
                appointment.getAppointmentDate(),
                AppointmentStatus.WAITING,
                appointment.getQueueNumber()
        );
    }

    @Override
    public List<Appointment> listToday() {
        return appointmentRepository.findByAppointmentDateOrderByQueueNumberAsc(LocalDate.now());
    }

    @Override
    public List<Appointment> listTodayByStatus(AppointmentStatus status) {
        return appointmentRepository.findByAppointmentDateAndStatusOrderByQueueNumberAsc(LocalDate.now(), status);
    }

    @Override
    @Transactional
    public Appointment updateStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment ap = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NoSuchElementException("Randevu bulunamadı: id=" + appointmentId));
        ap.setStatus(newStatus);
        return appointmentRepository.save(ap);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new NoSuchElementException("Randevu bulunamadı: id=" + id);
        }
        appointmentRepository.deleteById(id);
    }
}
