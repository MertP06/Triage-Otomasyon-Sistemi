package com.acil.er_backend.controller;

import com.acil.er_backend.service.MedicalDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical")
@CrossOrigin(origins = "*")
public class MedicalDataController {

    @Autowired
    private MedicalDataService medicalDataService;

    @GetMapping
    public List<Map<String, Object>> getAllData() {
        return medicalDataService.getAllMedicalData();
    }
}
