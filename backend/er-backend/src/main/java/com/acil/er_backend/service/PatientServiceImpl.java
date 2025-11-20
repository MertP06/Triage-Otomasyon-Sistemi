package com.acil.er_backend.service;

import com.acil.er_backend.model.Patient;
import com.acil.er_backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Long id) {
        Optional<Patient> optional = patientRepository.findById(id);
        return optional.orElse(null);
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public boolean existsByTc(String tc) {
        return patientRepository.existsByTc(tc);
    }

    // PUT: Tüm alanları güncelle (name, tc, basicSymptomsCsv)
    @Override
    public Patient updatePatient(Long id, Patient updated) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı: " + id));

        existing.setName(updated.getName());
        existing.setTc(updated.getTc());
        existing.setBasicSymptomsCsv(updated.getBasicSymptomsCsv());

        return patientRepository.save(existing);
    }

    // PATCH: Sadece gelen alanları güncelle
    @Override
    public Patient partialUpdatePatient(Long id, Patient patch) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hasta bulunamadı: " + id));

        if (patch.getName() != null) existing.setName(patch.getName());
        if (patch.getTc() != null) existing.setTc(patch.getTc());
        if (patch.getBasicSymptomsCsv() != null) existing.setBasicSymptomsCsv(patch.getBasicSymptomsCsv());

        return patientRepository.save(existing);
    }
}
