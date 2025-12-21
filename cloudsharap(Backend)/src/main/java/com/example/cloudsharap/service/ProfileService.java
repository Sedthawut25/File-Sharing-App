package com.example.cloudsharap.service;

import com.example.cloudsharap.dto.ProfileDTO;
import com.example.cloudsharap.ducoment.ProfileDocument;
import com.example.cloudsharap.repository.ProfileRepository;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileDTO createProfile(ProfileDTO profileDTO) {

        if(profileRepository.existsByClerkId(profileDTO.getClerkId())) {
            return updateProfile(profileDTO);
        }

        ProfileDocument profile = ProfileDocument .builder()
                .clerkId(profileDTO.getClerkId())
                .email(profileDTO.getEmail())
                .firstname(profileDTO.getFirstname())
                .lastname(profileDTO.getLastname())
                .photoUrl(profileDTO.getPhotoUrl())
                .credits(5)
                .createdAt(Instant.now())
                .build();

        profile = profileRepository.save(profile);

        return ProfileDTO.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstname(profile.getFirstname())
                .lastname(profile.getLastname())
                .photoUrl(profile.getPhotoUrl())
                .credits(profile.getCredits())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public  ProfileDTO updateProfile(ProfileDTO profileDTO) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(profileDTO.getClerkId());

        if(existingProfile != null){
            if(profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()){
                existingProfile.setEmail(profileDTO.getEmail());
            }

            if(profileDTO.getFirstname() != null && !profileDTO.getFirstname().isEmpty()){
                existingProfile.setFirstname(profileDTO.getFirstname());
            }

            if(profileDTO.getLastname() != null && !profileDTO.getLastname().isEmpty()){
                existingProfile.setLastname(profileDTO.getLastname());
            }

            if(profileDTO.getPhotoUrl() != null && !profileDTO.getPhotoUrl().isEmpty()){
                existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());
            }

             profileRepository.save(existingProfile);

            return ProfileDTO.builder()
                    .id(existingProfile.getId())
                    .email(existingProfile.getEmail())
                    .clerkId(existingProfile.getClerkId())
                    .firstname(existingProfile.getFirstname())
                    .lastname(existingProfile.getLastname())
                    .photoUrl(existingProfile.getPhotoUrl())
                    .credits(existingProfile.getCredits())
                    .createdAt(existingProfile.getCreatedAt())
                    .build();
        }
        return null;
    }

    public boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }

    public void deleteProfile(String clerkId) {
        ProfileDocument existingProfile = profileRepository.findByClerkId(clerkId);
        if(existingProfile != null){
            profileRepository.delete(existingProfile);
        }
    }

    public ProfileDocument getCurrentProfile() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new UsernameNotFoundException("USer not authenticated");
        }

        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepository.findByClerkId(clerkId);
    }
}
