package com.example.cloudsharap.controller;

import com.example.cloudsharap.dto.UserCreditsDTO;
import com.example.cloudsharap.ducoment.UserCredits;
import com.example.cloudsharap.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserCreditsController {

    private final UserCreditsService userCreditsService;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserCredits usercredits = userCreditsService.getUserCredits();
        UserCreditsDTO response = UserCreditsDTO.builder()
                .credits(usercredits.getCredits())
                .plan(usercredits.getPlan())
                .build();
        return ResponseEntity.ok(response);
    }
}
