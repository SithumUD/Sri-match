package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankDetailResponse {
    private Long id;
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String accountHolderName;
    private boolean active;
}
