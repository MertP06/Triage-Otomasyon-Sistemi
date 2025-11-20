package com.acil.er_backend.model;

public enum AppointmentStatus {
    WAITING,      // Sırada bekliyor
    CALLED,       // Yanıta çağrıldı
    IN_PROGRESS,  // Muayenede
    DONE,         // Tamamlandı
    CANCELED      // İptal
}
