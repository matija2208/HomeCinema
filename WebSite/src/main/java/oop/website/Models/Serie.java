package oop.website.Models;

import java.util.List;

public class Serie
{

    private String name;
    private int year;
    private String category;
    private int noOfSeasons;
    private List<Season> seasons;

    public Serie(int year, String name, String category, int noOfSeasons)
    {
        this.year = year;
        this.name = name;
        this.category = category;
        this.noOfSeasons = noOfSeasons;
        this.seasons = null;
    }

    public Serie(int year, String name, int noOfSeasons)
    {
        this.year = year;
        this.name = name;
        this.noOfSeasons = noOfSeasons;
        this.category = null;
        this.seasons = null;
    }

    public Serie()
    {
        this.year = 0;
        this.name = null;
        this.category = null;
        this.noOfSeasons = 0;
        this.seasons = null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getNoOfSeasons() {
        return noOfSeasons;
    }

    public void setNoOfSeasons(int noOfSeasons) {
        this.noOfSeasons = noOfSeasons;
    }

    public List<Season> getSeasons() {
        return seasons;
    }

    public void setSeasons(List<Season> seasons) {
        this.noOfSeasons = seasons.size();
        this.seasons = seasons;
    }
}
