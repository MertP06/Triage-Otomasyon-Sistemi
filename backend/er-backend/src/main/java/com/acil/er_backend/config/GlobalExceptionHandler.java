package com.acil.er_backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Uygulama genelinde hata yakalayıcı.
 * - Validasyon hatalarını JSON olarak döner.
 * - NotFound ve Runtime hatalarını tek formatta gösterir.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔹 @Valid hataları (RequestBody, PathVariable vs.)
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<?> handleValidation(Exception ex) {
        List<Map<String, String>> errors = new ArrayList<>();
        var binding = ex instanceof MethodArgumentNotValidException manv
                ? manv.getBindingResult()
                : ((BindException) ex).getBindingResult();

        binding.getFieldErrors().forEach(fe -> {
            errors.add(Map.of(
                    "field", fe.getField(),
                    "message", fe.getDefaultMessage()
            ));
        });

        return ResponseEntity.badRequest().body(Map.of(
                "status", 400,
                "error", "Validation Error",
                "errors", errors
        ));
    }

    // 🔹 NotFound (örnek: hasta/randevu bulunamadı)
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<?> notFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
        ));
    }

    // 🔹 Diğer hatalar (iş mantığı, parse vs.)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> runtime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "status", 400,
                "error", "Bad Request",
                "message", ex.getMessage()
        ));
    }
}
