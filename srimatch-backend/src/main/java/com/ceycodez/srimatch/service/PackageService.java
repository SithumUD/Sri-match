package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.PremiumPackageRequest;
import com.ceycodez.srimatch.dto.response.PremiumPackageResponse;
import com.ceycodez.srimatch.model.PremiumPackage;
import com.ceycodez.srimatch.repository.PremiumPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PremiumPackageRepository packageRepository;

    @Transactional
    public PremiumPackageResponse createPackage(PremiumPackageRequest request) {
        PremiumPackage pkg = PremiumPackage.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .timelineMonths(request.getTimelineMonths())
                .offerPercentage(request.getOfferPercentage())
                .build();
        return PremiumPackageResponse.fromEntity(packageRepository.save(pkg));
    }

    @Transactional
    public PremiumPackageResponse updatePackage(Long id, PremiumPackageRequest request) {
        PremiumPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setTimelineMonths(request.getTimelineMonths());
        pkg.setOfferPercentage(request.getOfferPercentage());
        
        return PremiumPackageResponse.fromEntity(packageRepository.save(pkg));
    }

    @Transactional
    public void togglePackageStatus(Long id) {
        PremiumPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        pkg.setActive(!pkg.isActive());
        packageRepository.save(pkg);
    }

    public List<PremiumPackageResponse> getAllPackages(boolean activeOnly) {
        List<PremiumPackage> packages = activeOnly ? packageRepository.findByActiveTrue() : packageRepository.findAll();
        return packages.stream().map(PremiumPackageResponse::fromEntity).collect(Collectors.toList());
    }

    public PremiumPackageResponse getPackageById(Long id) {
        return packageRepository.findById(id)
                .map(PremiumPackageResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }
}
