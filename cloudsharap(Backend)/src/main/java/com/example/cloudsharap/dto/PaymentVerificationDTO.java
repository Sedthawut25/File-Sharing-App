package com.example.cloudsharap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerificationDTO {
    private String planId;

    // ถ้าคุณยังใช้ field เดิมจากฝั่ง frontend/postman ก็เก็บไว้ได้
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
}