package com.acil.er_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "triage_records", indexes = {
        @Index(name = "idx_triage_appointment", columnList = "appointment_id")
})
public class TriageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    @JsonIgnore
    private Appointment appointment;

    @Column(columnDefinition = "TEXT")
    private String nurseSymptomsCsv;

    private Double temperature;
    private Integer pulse;
    private Integer bpHigh;
    private Integer bpLow;
    private Double painLevel;
    private String triageLevel;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "TEXT")
    private String suggestionsJson;

    private LocalDateTime createdAt = LocalDateTime.now();

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public String getNurseSymptomsCsv() { return nurseSymptomsCsv; }
    public void setNurseSymptomsCsv(String nurseSymptomsCsv) { this.nurseSymptomsCsv = nurseSymptomsCsv; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getPulse() { return pulse; }
    public void setPulse(Integer pulse) { this.pulse = pulse; }

    public Integer getBpHigh() { return bpHigh; }
    public void setBpHigh(Integer bpHigh) { this.bpHigh = bpHigh; }

    public Integer getBpLow() { return bpLow; }
    public void setBpLow(Integer bpLow) { this.bpLow = bpLow; }

    public Double getPainLevel() { return painLevel; }
    public void setPainLevel(Double painLevel) { this.painLevel = painLevel; }

    public String getTriageLevel() { return triageLevel; }
    public void setTriageLevel(String triageLevel) { this.triageLevel = triageLevel; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSuggestionsJson() { return suggestionsJson; }
    public void setSuggestionsJson(String suggestionsJson) { this.suggestionsJson = suggestionsJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
