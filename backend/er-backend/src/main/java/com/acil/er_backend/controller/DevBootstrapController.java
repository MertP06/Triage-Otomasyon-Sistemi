package com.acil.er_backend.controller;

import com.acil.er_backend.model.Patient;
import com.acil.er_backend.service.AppointmentService;
import com.acil.er_backend.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
@CrossOrigin(origins = "*")
public class DevBootstrapController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    public DevBootstrapController(PatientService patientService,
                                  AppointmentService appointmentService) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
    }

    @PostMapping("/quick-appointment")
    public ResponseEntity<?> quickAppointment(@RequestBody QuickAppointmentRequest req) {
        // 1) Hasta var mı? yoksa oluştur
        Patient p;
        if (req.patientId != null) {
            p = patientService.getPatientById(req.patientId);
            if (p == null) return ResponseEntity.badRequest().body(Map.of("error","Geçersiz patientId"));
        } else {
            p = new Patient();
            p.setName(req.name != null ? req.name : "Test Hasta");
            p.setTc(req.tc != null ? req.tc : String.valueOf(System.currentTimeMillis()).substring(2,13));
            p.setBasicSymptomsCsv(req.basicSymptomsCsv);
            p = patientService.savePatient(p);
        }

        // 2) Randevu oluştur (artık symptomsCsv yok)
        var ap = appointmentService.createAppointment(p.getId());
        long ahead = appointmentService.countWaitingAheadFor(ap);

        return ResponseEntity.ok(Map.of(
                "patientId", p.getId(),
                "appointmentId", ap.getId(),
                "queueNumber", ap.getQueueNumber(),
                "status", ap.getStatus().name(),
                "aheadCount", ahead,
                "appointmentDate", ap.getAppointmentDate().toString()
        ));
    }

    public static class QuickAppointmentRequest {
        public Long patientId;       // varsa direkt kullan
        public String name;          // yoksa yeni hasta için
        public String tc;            // yoksa yeni hasta için
        public String basicSymptomsCsv; // mobilin temel şikayetleri (opsiyonel)
    }
}
