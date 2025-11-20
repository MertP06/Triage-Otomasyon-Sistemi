package com.acil.er_backend.controller;

import com.acil.er_backend.dto.CreateTriageRequest;
import com.acil.er_backend.model.TriageRecord;
import com.acil.er_backend.service.TriageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/triage")
@CrossOrigin(origins = "*")
public class TriageController {

    private final TriageService triageService;

    public TriageController(TriageService triageService) {
        this.triageService = triageService;
    }

    // Hemşire: Triage kaydı oluştur (validasyonlu)
    @PostMapping
    public ResponseEntity<TriageRecord> create(@RequestBody @Valid CreateTriageRequest req) {
        return ResponseEntity.ok(triageService.create(req));
    }

    // (Opsiyonel) Bir randevuya ait triage kayıtları
    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<List<TriageRecord>> list(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(triageService.listByAppointment(appointmentId));
    }
}
