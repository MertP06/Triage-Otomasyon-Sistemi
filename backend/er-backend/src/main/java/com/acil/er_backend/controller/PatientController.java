package com.acil.er_backend.controller;

import com.acil.er_backend.model.Patient;
import com.acil.er_backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // 1) Yeni hasta (name, tc, basicSymptomsCsv opsiyonel)
    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        if (patient.getTc() == null || patient.getTc().length() != 11) {
            return ResponseEntity.badRequest().body(Map.of("error", "TC 11 haneli olmalı."));
        }
        if (patientService.existsByTc(patient.getTc())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bu TC ile kayıtlı hasta zaten var."));
        }
        Patient savedPatient = patientService.savePatient(patient);
        return ResponseEntity.ok(savedPatient);
    }

    // 2) Tüm hastalar
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    // 3) ID ile hasta
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        Patient patient = patientService.getPatientById(id);
        if (patient == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(patient);
    }

    // 4) Hasta sil
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(Map.of("message", "Hasta başarıyla silindi."));
    }

    // 5) PUT tam güncelleme (name, tc, basicSymptomsCsv)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        try {
            Patient updated = patientService.updatePatient(id, updatedPatient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 6) PATCH kısmi güncelleme
    @PatchMapping("/{id}")
    public ResponseEntity<?> partialUpdatePatient(@PathVariable Long id, @RequestBody Patient partialPatient) {
        try {
            Patient updated = patientService.partialUpdatePatient(id, partialPatient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
