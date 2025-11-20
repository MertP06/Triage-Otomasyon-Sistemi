package com.acil.er_backend.dto;

import com.acil.er_backend.model.Appointment;
import com.acil.er_backend.model.DoctorNote;
import com.acil.er_backend.model.Patient;
import com.acil.er_backend.model.TriageRecord;

import java.util.List;

public class AppointmentDetailResponse {
    public Patient patient;
    public Appointment appointment;
    public List<TriageRecord> triageRecords;
    public List<DoctorNote> doctorNotes;
}
