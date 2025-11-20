package com.acil.er_backend.dto;

import jakarta.validation.constraints.*;

/**
 * Doktorun muayene notu isteği.
 */
public class DoctorNoteRequest {

    @NotNull(message = "appointmentId boş olamaz.")
    public Long appointmentId;

    @NotBlank(message = "Tanı (diagnosis) boş olamaz.")
    public String diagnosis;

    @NotBlank(message = "Plan (plan) boş olamaz.")
    public String plan;
}
