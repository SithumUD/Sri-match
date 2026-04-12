package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponse {
    private Long id;
    private String firstName;
    private Integer age;
    private String city;
    private String district;
    private String profession;
    private String education;
    private String religion;
    private String about;
    private List<String> interests;
    private String profileImage;
    private boolean isVerified;
    private boolean isBoosted;
    private Integer compatibilityScore;
}
