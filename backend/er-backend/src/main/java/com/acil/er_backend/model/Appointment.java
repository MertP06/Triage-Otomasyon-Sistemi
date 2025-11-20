package com.acil.er_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "appointments", indexes = {
        @Index(name = "idx_appointments_appointment_date", columnList = "appointmentDate")
})
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @Column(nullable = false)
    private Integer queueNumber;

    @Column(nullable = false)
    private LocalDate appointmentDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.WAITING;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Randevu silinince bağlı kayıtlar da gitsin; JSON'a bu listeleri koymuyoruz
    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TriageRecord> triageRecords;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DoctorNote> doctorNotes;

    // --- Getter / Setter ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<TriageRecord> getTriageRecords() { return triageRecords; }
    public void setTriageRecords(List<TriageRecord> triageRecords) { this.triageRecords = triageRecords; }

    public List<DoctorNote> getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(List<DoctorNote> doctorNotes) { this.doctorNotes = doctorNotes; }
}
