package com.acil.er_backend.service;

import com.acil.er_backend.dto.CreateTriageRequest;
import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.TriageRecord;
import com.acil.er_backend.repository.AppointmentRepository;
import com.acil.er_backend.repository.TriageRecordRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TriageServiceImpl implements TriageService {

    private final AppointmentRepository appointmentRepository;
    private final TriageRecordRepository triageRecordRepository;
    private final MedicalInferenceService inferenceService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TriageServiceImpl(AppointmentRepository appointmentRepository,
                             TriageRecordRepository triageRecordRepository,
                             MedicalInferenceService inferenceService) {
        this.appointmentRepository = appointmentRepository;
        this.triageRecordRepository = triageRecordRepository;
        this.inferenceService = inferenceService;
    }

    @Override
    @Transactional
    public TriageRecord create(CreateTriageRequest req) {
        Appointment ap = appointmentRepository.findById(req.appointmentId)
                .orElseThrow(() -> new RuntimeException("Randevu bulunamadı: " + req.appointmentId));

        TriageRecord tr = new TriageRecord();
        tr.setAppointment(ap);
        tr.setNurseSymptomsCsv(req.nurseSymptomsCsv);
        tr.setTemperature(req.temperature);
        tr.setPulse(req.pulse);
        tr.setBpHigh(req.bpHigh);
        tr.setBpLow(req.bpLow);
        tr.setPainLevel(req.painLevel);
        tr.setTriageLevel(req.triageLevel);
        tr.setNotes(req.notes);
        tr.setCreatedAt(LocalDateTime.now());

        // Öneriler: sadece {urgency_level, reasoning}
        List<String> nurseSymptoms = parseCsv(req.nurseSymptomsCsv);
        try {
            var minimalSuggestions = inferenceService.suggestTop5(nurseSymptoms);
            if (minimalSuggestions != null && !minimalSuggestions.isEmpty()) {
                tr.setSuggestionsJson(objectMapper.writeValueAsString(minimalSuggestions));
            }
        } catch (Exception ignore) { }

        return triageRecordRepository.save(tr);
    }

    @Override
    public List<TriageRecord> listByAppointment(Long appointmentId) {
        return triageRecordRepository.findByAppointment_IdOrderByCreatedAtDesc(appointmentId);
    }

    // ---- yardımcılar ----
    private static List<String> parseCsv(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }
}
