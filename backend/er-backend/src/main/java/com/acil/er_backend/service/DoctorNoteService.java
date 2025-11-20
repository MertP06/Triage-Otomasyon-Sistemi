package com.acil.er_backend.service;

import com.acil.er_backend.dto.DoctorNoteRequest;
import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.AppointmentStatus;
import com.acil.er_backend.model.DoctorNote;
import com.acil.er_backend.repository.AppointmentRepository;
import com.acil.er_backend.repository.DoctorNoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class DoctorNoteService {

    private final DoctorNoteRepository noteRepo;
    private final AppointmentRepository appointmentRepo;

    public DoctorNoteService(DoctorNoteRepository noteRepo, AppointmentRepository appointmentRepo) {
        this.noteRepo = noteRepo;
        this.appointmentRepo = appointmentRepo;
    }

    @Transactional
    public DoctorNote createAndOptionallyComplete(DoctorNoteRequest req, boolean markDone) {
        Appointment ap = appointmentRepo.findById(req.appointmentId)
                .orElseThrow(() -> new NoSuchElementException("Randevu bulunamadı: " + req.appointmentId));

        DoctorNote note = new DoctorNote();
        note.setAppointment(ap);
        note.setDiagnosis(req.diagnosis);
        note.setPlan(req.plan);
        DoctorNote saved = noteRepo.save(note);

        if (markDone) {
            ap.setStatus(AppointmentStatus.DONE);
            appointmentRepo.save(ap);
        }
        return saved;
    }
}
