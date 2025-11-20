package com.acil.er_backend.controller;

import com.acil.er_backend.dto.AppointmentDetailResponse;
import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.AppointmentStatus;
import com.acil.er_backend.repository.AppointmentRepository;
import com.acil.er_backend.repository.DoctorNoteRepository;
import com.acil.er_backend.repository.TriageRecordRepository;
import com.acil.er_backend.service.AppointmentService;
import com.acil.er_backend.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;

    private final AppointmentRepository appointmentRepository;
    private final TriageRecordRepository triageRecordRepository;
    private final DoctorNoteRepository doctorNoteRepository;

    public AppointmentController(AppointmentService appointmentService,
            PatientService patientService,
            AppointmentRepository appointmentRepository,
            TriageRecordRepository triageRecordRepository,
            DoctorNoteRepository doctorNoteRepository) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
        this.appointmentRepository = appointmentRepository;
        this.triageRecordRepository = triageRecordRepository;
        this.doctorNoteRepository = doctorNoteRepository;
    }

    // 1) Randevu oluştur
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateAppointmentRequest req) {
        if (req.patientId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "patientId gerekli"));
        }
        Appointment ap = appointmentService.createAppointment(req.patientId);
        long ahead = appointmentService.countWaitingAheadFor(ap);

        Map<String, Object> resp = new HashMap<>();
        resp.put("appointmentId", ap.getId());
        resp.put("queueNumber", ap.getQueueNumber());
        resp.put("status", ap.getStatus().name());
        resp.put("aheadCount", ahead);
        resp.put("appointmentDate", ap.getAppointmentDate().toString());
        return ResponseEntity.ok(resp);
    }

    // 2) TC ile durum
    @GetMapping("/status/{tc}")
    public ResponseEntity<?> status(@PathVariable String tc) {
        return appointmentService.findTodayActiveByTc(tc)
                .<ResponseEntity<?>>map(ap -> {
                    long ahead = appointmentService.countWaitingAheadFor(ap);
                    return ResponseEntity.ok(Map.of(
                            "appointmentId", ap.getId(),
                            "appointmentDate", ap.getAppointmentDate().toString(),
                            "status", ap.getStatus().name(),
                            "aheadCount", ahead,
                            "queueNumber", ap.getQueueNumber()));
                })
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "message", "Bugün için aktif randevu bulunamadı.",
                        "hasActive", false)));
    }

    // 3) Bugünkü randevular
    @GetMapping("/today")
    public List<Appointment> today(@RequestParam(required = false) AppointmentStatus status) {
        if (status != null) {
            return appointmentService.listTodayByStatus(status);
        }
        return appointmentService.listToday();
    }

    // 3.a) Bugün - sıradaki bekleyen (en küçük sıra numarası)
    @GetMapping("/today/next")
    public ResponseEntity<?> nextWaiting() {
        List<Appointment> waiting = appointmentService.listTodayByStatus(AppointmentStatus.WAITING);
        if (waiting.isEmpty()) {
            return ResponseEntity.ok(Map.of("hasNext", false));
        }
        Appointment next = waiting.get(0);
        return ResponseEntity.ok(Map.of(
                "hasNext", true,
                "appointmentId", next.getId(),
                "queueNumber", next.getQueueNumber(),
                "patient", next.getPatient()));
    }

    // 4) Durum güncelle
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        Appointment ap = appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of(
                "appointmentId", ap.getId(),
                "status", ap.getStatus().name()));
    }

    // 5) Sil
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Randevu başarıyla silindi.", "appointmentId", id));
    }

    // 6) Doktor ekranı: detay (DTO ile)
    @GetMapping("/{id}/detail")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ap -> {
                    AppointmentDetailResponse dto = new AppointmentDetailResponse();
                    dto.appointment = ap;
                    dto.patient = ap.getPatient();
                    dto.triageRecords = triageRecordRepository.findByAppointment_IdOrderByCreatedAtDesc(id);
                    dto.doctorNotes = doctorNoteRepository.findByAppointment_IdOrderByCreatedAtDesc(id);
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- DTO ---
    public static class CreateAppointmentRequest {
        public Long patientId;
    }

}
