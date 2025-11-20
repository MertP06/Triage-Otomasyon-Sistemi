package com.acil.er_backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class MedicalDataService {

    private List<Map<String, Object>> medicalDataList;

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("medical_data.json");
            medicalDataList = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Map<String, Object>> getAllMedicalData() {
        return medicalDataList;
    }
}
