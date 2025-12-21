package com.example.cloudsharap.controller;

import com.example.cloudsharap.dto.ProfileDTO;
import com.example.cloudsharap.service.ProfileService;
import com.example.cloudsharap.service.UserCreditsService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(
            @RequestHeader(value = "svix-id", required = false) String svixId,
            @RequestHeader(value = "svix-timestamp", required = false) String svixTimestamp,
            @RequestHeader(value = "svix-signature", required = false) String svixSignature,
            @RequestBody String payload
    ) {
        try {
            log.info("Clerk webhook received: id={}, ts={}", svixId, svixTimestamp);
            log.debug("Clerk payload: {}", payload);

            // TODO: ภายหลังค่อยเขียน verify จริง ๆ
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                log.warn("Invalid webhook signature");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid webhook signature");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(payload);

            String eventType = rootNode.path("type").asText();
            JsonNode data = rootNode.path("data");

            log.info("Clerk event type = {}", eventType);

            switch (eventType) {
                case "user.created" -> handleUserCreated(data);
                case "user.updated" -> handleUserUpdated(data);
                case "user.deleted" -> handleUserDeleted(data);
                default -> log.warn("Unhandled Clerk event type: {}", eventType);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error handling Clerk webhook", e);
            // ตอน debug ขอเป็น 500 ก่อน จะได้เข้าใจว่าพังตรงไหน
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.path("id").asText();
        log.info("Handle user.deleted for clerkId={}", clerkId);
        profileService.deleteProfile(clerkId);
        // ถ้าอยากลบเครดิตด้วยก็เรียก userCreditsService ลบที่นี่
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();

        // ✅ email_addresses (array) → [0].email_address
        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            email = emailAddresses.get(0).path("email_address").asText("");
        }

        String firstname = data.path("first_name").asText("");
        String lastname = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        ProfileDTO updateProfile = ProfileDTO.builder()
                .clerkId(clerkId)
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .photoUrl(photoUrl)
                .build();

        log.info("Updating profile for clerkId={} email={}", clerkId, email);

        updateProfile = profileService.updateProfile(updateProfile);

        // ถ้าไม่มีอยู่ใน DB ให้สร้างใหม่
        if (updateProfile == null) {
            handleUserCreated(data);
        }
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.path("id").asText();

        String email = "";
        JsonNode emailAddresses = data.path("email_addresses");
        if (emailAddresses.isArray() && emailAddresses.size() > 0) {
            email = emailAddresses.get(0).path("email_address").asText("");
        }

        String firstname = data.path("first_name").asText("");
        String lastname = data.path("last_name").asText("");
        String photoUrl = data.path("image_url").asText("");

        log.info("Creating profile for clerkId={} email={}", clerkId, email);

        ProfileDTO newProfile = ProfileDTO.builder()
                .clerkId(clerkId)
                .email(email)
                .firstname(firstname)
                .lastname(lastname)
                .photoUrl(photoUrl)
                .build();

        profileService.createProfile(newProfile);
        userCreditsService.createInitialCredits(clerkId);
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp,
                                           String svixSignature, String payload) {
        // ตอนนี้ให้ผ่านไปก่อน เพื่อ debug flow ให้ครบ
        // ภายหลังค่อยใช้ Lib ของ Clerk / Svix ตาม docs
        return true;
    }
}
