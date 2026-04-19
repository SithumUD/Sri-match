package com.ceycodez.srimatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "name_si")
    private String nameSi;

    @Column(name = "name_ta")
    private String nameTa;

    @Column(name = "sub_name_en")
    private String subNameEn;

    @Column(name = "sub_name_si")
    private String subNameSi;

    @Column(name = "sub_name_ta")
    private String subNameTa;

    private String postcode;

    private Double latitude;

    private Double longitude;
}
