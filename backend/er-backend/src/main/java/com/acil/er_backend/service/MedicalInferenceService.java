package com.acil.er_backend.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Hemşirenin seçtiği semptomlara göre medical_data.json içinden
 * ilk 5 eşleşmeyi çıkarır ve SADECE {urgency_level, reasoning} döner.
 */
@Service
public class MedicalInferenceService {

    private final MedicalDataService dataService;

    public MedicalInferenceService(MedicalDataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Sadece {urgency_level, reasoning} döner.
     * Sıralama: önce eşleşen semptom sayısı (desc), eşitse urgency_level (desc).
     */
    public List<Map<String, Object>> suggestTop5(List<String> nurseSymptoms) {
        if (nurseSymptoms == null || nurseSymptoms.isEmpty()) {
            return List.of();
        }
        final List<String> symptomsLc = nurseSymptoms.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .toList();

        // Eşleşme + puanlama
        List<Map<String, Object>> scored = dataService.getAllMedicalData().stream()
                .map(item -> {
                    @SuppressWarnings("unchecked")
                    List<String> itemSymptoms = (List<String>) item.getOrDefault("symptoms", List.of());
                    long matchCount = itemSymptoms.stream()
                            .filter(Objects::nonNull)
                            .map(String::toLowerCase)
                            .filter(s -> symptomsLc.stream().anyMatch(x -> s.contains(x) || x.contains(s)))
                            .count();
                    if (matchCount == 0) return null;

                    // İç sıralama için tutuyoruz (dışarı vermeyeceğiz)
                    Map<String, Object> tmp = new HashMap<>();
                    tmp.put("urgency_level", item.get("urgency_level"));
                    tmp.put("reasoning", item.get("reasoning"));
                    tmp.put("_matchScore", matchCount);
                    return tmp;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Sıralama: matchScore DESC, sonra urgency_level DESC (5=çok acil > 1=acil)
        scored.sort((a, b) -> {
            long mB = ((Number) b.get("_matchScore")).longValue();
            long mA = ((Number) a.get("_matchScore")).longValue();
            if (mB != mA) return Long.compare(mB, mA);
            int uB = ((Number) b.getOrDefault("urgency_level", 0)).intValue();
            int uA = ((Number) a.getOrDefault("urgency_level", 0)).intValue();
            return Integer.compare(uB, uA);
        });

        // İlk 5 + sadece istenen alanlar
        return scored.stream()
                .limit(5)
                .map(m -> Map.of(
                        "urgency_level", m.get("urgency_level"),
                        "reasoning", m.get("reasoning")
                ))
                .collect(Collectors.toList());
    }
}
