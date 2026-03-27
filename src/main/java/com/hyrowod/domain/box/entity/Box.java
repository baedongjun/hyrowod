package com.hyrowod.domain.box.entity;

import com.hyrowod.common.BaseEntity;
import com.hyrowod.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boxes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Box extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;       // 서울, 경기, 부산 등

    private String district;   // 강남구, 마포구 등

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    private String phone;
    private String website;
    private String instagram;
    private String youtube;

    @Column(length = 2000)
    private String description;

    private Integer monthlyFee;  // 월 회비 (원)

    private String openTime;    // "06:00"
    private String closeTime;   // "22:00"

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "box_images", joinColumns = @JoinColumn(name = "box_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Column(precision = 3, scale = 1)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    private Integer reviewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Builder.Default
    private boolean verified = false;   // 인증 박스

    @Builder.Default
    private boolean premium = false;    // 프리미엄 노출

    @Builder.Default
    private boolean active = true;
}
