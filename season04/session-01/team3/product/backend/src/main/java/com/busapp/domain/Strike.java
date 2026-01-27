package com.busapp.domain;

import java.time.LocalDateTime;
import java.util.List;

public class Strike {
    private Long id;
    private String title;
    private String description;
    private StrikeStatus status;
    private LocalDateTime strikeDate;
    private List<String> affectedRegions;
    private List<String> busTypes;
    private String sourceUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Strike(Long id, String title, String description, StrikeStatus status,
                  LocalDateTime strikeDate, List<String> affectedRegions, List<String> busTypes,
                  String sourceUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.strikeDate = strikeDate;
        this.affectedRegions = affectedRegions;
        this.busTypes = busTypes;
        this.sourceUrl = sourceUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public StrikeStatus getStatus() { return status; }
    public LocalDateTime getStrikeDate() { return strikeDate; }
    public List<String> getAffectedRegions() { return affectedRegions; }
    public List<String> getBusTypes() { return busTypes; }
    public String getSourceUrl() { return sourceUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}