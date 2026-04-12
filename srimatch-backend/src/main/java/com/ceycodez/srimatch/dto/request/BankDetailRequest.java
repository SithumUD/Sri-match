package com.ceycodez.srimatch.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankDetailRequest {
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String accountHolderName;
}
