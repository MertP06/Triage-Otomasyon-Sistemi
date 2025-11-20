package com.acil.er_backend.controller;

import com.acil.er_backend.dto.DoctorNoteRequest;
import com.acil.er_backend.model.DoctorNote;
import com.acil.er_backend.repository.DoctorNoteRepository;
import com.acil.er_backend.service.DoctorNoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor-notes")
@CrossOrigin(origins = "*")
public class DoctorNoteController {

    private final DoctorNoteService doctorNoteService;
    private final DoctorNoteRepository noteRepo;

    public DoctorNoteController(DoctorNoteService doctorNoteService, DoctorNoteRepository noteRepo) {
        this.doctorNoteService = doctorNoteService;
        this.noteRepo = noteRepo;
    }

    // Doktor: Muayene notu oluştur (randevuyu DONE yapmadan)
    @PostMapping
    public ResponseEntity<DoctorNote> create(@RequestBody @Valid DoctorNoteRequest req) {
        return ResponseEntity.ok(doctorNoteService.createAndOptionallyComplete(req, false));
    }

    // Doktor: Muayene notu oluştur + randevuyu DONE yap
    @PostMapping("/complete")
    public ResponseEntity<DoctorNote> createAndComplete(@RequestBody @Valid DoctorNoteRequest req) {
        return ResponseEntity.ok(doctorNoteService.createAndOptionallyComplete(req, true));
    }

    // (Opsiyonel) Bir randevuya ait doktor notlarını getir
    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<?> listByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(noteRepo.findByAppointment_IdOrderByCreatedAtDesc(appointmentId));
    }
}
