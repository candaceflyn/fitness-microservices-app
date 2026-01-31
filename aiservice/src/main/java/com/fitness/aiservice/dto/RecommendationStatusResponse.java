package com.fitness.aiservice.dto;

import com.fitness.aiservice.model.Recommendation;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendationStatusResponse {
    private String status; // PROCESSING | READY
    private Recommendation data;
}
