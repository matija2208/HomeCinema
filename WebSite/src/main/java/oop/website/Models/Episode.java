package oop.website.Models;

public class Episode extends File
{
    private int episodeNumber;
    private String name;

    public Episode(int episodeNumber, String name, String fileName)
    {
        super(fileName);
        this.episodeNumber = episodeNumber;
        this.name = name;
    }

    public Episode(int episodeNumber, String name)
    {
        super();
        this.episodeNumber = episodeNumber;
        this.name = name;
    }

    public Episode(int episodeNumber)
    {
        super();
        this.episodeNumber = episodeNumber;
        name = null;
    }
    public Episode()
    {
        super();
        episodeNumber = 0;
        name = null;
    }

    public int getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(int episodeNumber) {
        this.episodeNumber = episodeNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
