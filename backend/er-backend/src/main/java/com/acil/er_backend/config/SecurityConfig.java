package com.acil.er_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Sağlık/metrikler
                        .requestMatchers("/actuator/**").permitAll()

                        // --- HASTA/MOBİL AÇIK UÇLAR ---
                        .requestMatchers(HttpMethod.POST, "/api/patients").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/appointments").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/appointments/status/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/medical/**").permitAll()

                        // --- PERSONEL YETKİLİ UÇLAR ---
                        .requestMatchers("/api/triage/**").hasRole("NURSE")
                        .requestMatchers("/api/doctor-notes/**").hasRole("DOCTOR")

                        // Randevu diğer işlemleri (listeleme, durum değişikliği, silme) personel
                        .requestMatchers("/api/appointments/**").hasAnyRole("NURSE","DOCTOR")
                        // Hastaların diğer uçları (listeleme/silme/güncelleme) personel
                        .requestMatchers("/api/patients/**").hasAnyRole("NURSE","DOCTOR")

                        // Dev yardımcı uçları kapalı (istersen değiştir)
                        .requestMatchers("/api/dev/**").hasAnyRole("NURSE","DOCTOR")

                        // kalan her şey auth ister
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService users() {
        var nurse  = User.withUsername("nurse").password("nurse123").roles("NURSE").build();
        var doctor = User.withUsername("doctor").password("doctor123").roles("DOCTOR").build();
        return new InMemoryUserDetailsManager(nurse, doctor);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Demo için NoOp — prod'da BCrypt kullan!
        return NoOpPasswordEncoder.getInstance();
    }
}
