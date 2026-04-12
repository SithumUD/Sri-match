package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.BankDetailRequest;
import com.ceycodez.srimatch.dto.response.BankDetailResponse;
import com.ceycodez.srimatch.model.BankDetail;
import com.ceycodez.srimatch.repository.BankDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BankDetailService {

    private final BankDetailRepository bankDetailRepository;

    @Transactional
    public BankDetailResponse addBankDetail(BankDetailRequest request) {
        BankDetail bankDetail = BankDetail.builder()
                .bankName(request.getBankName())
                .branchName(request.getBranchName())
                .accountNumber(request.getAccountNumber())
                .accountHolderName(request.getAccountHolderName())
                .build();
        return mapToResponse(bankDetailRepository.save(bankDetail));
    }

    @Transactional
    public BankDetailResponse updateBankDetail(Long id, BankDetailRequest request) {
        BankDetail bankDetail = bankDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank detail not found"));
        
        bankDetail.setBankName(request.getBankName());
        bankDetail.setBranchName(request.getBranchName());
        bankDetail.setAccountNumber(request.getAccountNumber());
        bankDetail.setAccountHolderName(request.getAccountHolderName());
        
        return mapToResponse(bankDetailRepository.save(bankDetail));
    }

    @Transactional
    public void toggleBankDetailStatus(Long id) {
        BankDetail bankDetail = bankDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank detail not found"));
        bankDetail.setActive(!bankDetail.isActive());
        bankDetailRepository.save(bankDetail);
    }

    public List<BankDetailResponse> getAllBankDetails(boolean activeOnly) {
        List<BankDetail> details = activeOnly ? bankDetailRepository.findByActiveTrue() : bankDetailRepository.findAll();
        return details.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BankDetailResponse mapToResponse(BankDetail detail) {
        return BankDetailResponse.builder()
                .id(detail.getId())
                .bankName(detail.getBankName())
                .branchName(detail.getBranchName())
                .accountNumber(detail.getAccountNumber())
                .accountHolderName(detail.getAccountHolderName())
                .active(detail.isActive())
                .build();
    }
}
