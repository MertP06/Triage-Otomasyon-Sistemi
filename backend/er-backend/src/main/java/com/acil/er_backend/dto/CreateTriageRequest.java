package com.acil.er_backend.dto;

import jakarta.validation.constraints.*;

/**
 * Hemşirenin triage oluştururken girdiği bilgiler.
 * @Valid desteği ile Controller'da otomatik doğrulama yapılır.
 */
public class CreateTriageRequest {

    @NotNull(message = "appointmentId boş olamaz.")
    public Long appointmentId;

    @NotBlank(message = "Semptom listesi (nurseSymptomsCsv) boş olamaz.")
    public String nurseSymptomsCsv;

    @DecimalMin(value = "30.0", message = "Ateş en az 30°C olmalı.")
    @DecimalMax(value = "45.0", message = "Ateş en fazla 45°C olmalı.")
    public Double temperature;

    @Min(value = 20, message = "Nabız en az 20 olmalı.")
    @Max(value = 240, message = "Nabız en fazla 240 olmalı.")
    public Integer pulse;

    @Min(value = 50, message = "Büyük tansiyon (bpHigh) en az 50 olmalı.")
    @Max(value = 260, message = "Büyük tansiyon (bpHigh) en fazla 260 olmalı.")
    public Integer bpHigh;

    @Min(value = 30, message = "Küçük tansiyon (bpLow) en az 30 olmalı.")
    @Max(value = 200, message = "Küçük tansiyon (bpLow) en fazla 200 olmalı.")
    public Integer bpLow;

    @DecimalMin(value = "0.0", message = "Ağrı seviyesi 0'dan küçük olamaz.")
    @DecimalMax(value = "10.0", message = "Ağrı seviyesi 10'dan büyük olamaz.")
    public Double painLevel;

    @NotBlank(message = "Triage seviyesi (triageLevel) boş olamaz.")
    public String triageLevel;

    public String notes;
}
