package oop.website.Models;

import jakarta.annotation.Nullable;

public class SearchResult
{
    private String name;
    private String year;
    private String category;
    private String type;
    @Nullable
    private Integer seasonNumber;
    @Nullable
    private String seasonName;
    @Nullable
    private Integer episodeNumber;
    @Nullable
    private String episodeName;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Integer getSeasonNumber() {
        return seasonNumber;
    }

    public void setSeasonNumber(Integer seasonNumber) {
        this.seasonNumber = seasonNumber;
    }

    public Integer getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(Integer episodeNumber) {
        this.episodeNumber = episodeNumber;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Nullable
    public String getSeasonName() {
        return seasonName;
    }

    public void setSeasonName(@Nullable String seasonName) {
        this.seasonName = seasonName;
    }

    @Nullable
    public String getEpisodeName() {
        return episodeName;
    }

    public void setEpisodeName(@Nullable String episodeName) {
        this.episodeName = episodeName;
    }
}
