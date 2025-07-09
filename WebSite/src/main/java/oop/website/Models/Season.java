package oop.website.Models;

import java.util.List;

public class Season
{
    private int seasonNumber;
    private String name;
    private List<Episode> episodes;

    public Season(int seasonNumber, String name)
    {
        this.seasonNumber = seasonNumber;
        this.name = name;
        episodes = null;
    }

    public Season(int SeasonNumber)
    {
        this.seasonNumber = SeasonNumber;
        episodes = null;
        name=null;
    }

    public Season()
    {
        episodes = null;
        seasonNumber = 0;
        name=null;
    }

    public int getSeasonNumber() {
        return seasonNumber;
    }

    public void setSeasonNumber(int seasonNumber) {
        this.seasonNumber = seasonNumber;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Episode> getEpisodes() {
        return episodes;
    }

    public void setEpisodes(List<Episode> episodes) {
        this.episodes = episodes;
    }
}
