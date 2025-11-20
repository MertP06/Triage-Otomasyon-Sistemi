package com.acil.er_backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medical")
@CrossOrigin(origins = "*")
public class MedicalController {

    private List<Map<String, Object>> medicalData;

    public MedicalController() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        medicalData = mapper.readValue(
                new ClassPathResource("medical_data.json").getInputStream(),
                new TypeReference<List<Map<String, Object>>>() {}
        );
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchBySymptoms(@RequestParam(required = false) List<String> symptoms) {
        if (symptoms == null || symptoms.isEmpty()) {
            return List.of(Map.of("error", "Lütfen en az bir semptom girin."));
        }

        List<Map<String, Object>> matched = new ArrayList<>();

        for (Map<String, Object> item : medicalData) {
            List<String> itemSymptoms = (List<String>) item.get("symptoms");
            if (itemSymptoms == null) continue;

            long matchCount = symptoms.stream()
                    .filter(symptom -> itemSymptoms.stream()
                            .anyMatch(s -> s.toLowerCase().contains(symptom.toLowerCase())))
                    .count();

            if (matchCount > 0) {
                Map<String, Object> copy = new HashMap<>(item); // orijinali mutasyona uğratma
                copy.put("matchScore", matchCount);
                matched.add(copy);
            }
        }

        return matched.stream()
                .sorted((a, b) -> Long.compare((Long) b.get("matchScore"), (Long) a.get("matchScore")))
                .limit(5)
                .collect(Collectors.toList());
    }

    @GetMapping("/symptoms")
    public List<String> allSymptoms() {
        return medicalData.stream()
                .flatMap(m -> ((List<String>) m.getOrDefault("symptoms", List.of())).stream())
                .map(String::toLowerCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
