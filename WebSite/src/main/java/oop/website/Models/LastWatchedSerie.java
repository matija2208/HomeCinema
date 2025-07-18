package oop.website.Models;

public class LastWatchedSerie extends Serie
{
    String timeStamp;
    String lastWatched;
    String episodeName;
    int episodeNumber;
    String seasonName;
    int seasonNumber;
    String fileName;

    public LastWatchedSerie()
    {
        super();
        timeStamp = null;
        lastWatched = null;
        episodeName = null;
        episodeNumber = 0;
        seasonName = null;
        seasonNumber = 0;
        fileName = null;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getLastWatched() {
        return lastWatched;
    }

    public void setLastWatched(String lastWatched) {
        this.lastWatched = lastWatched;
    }

    public String getEpisodeName() {
        return episodeName;
    }

    public void setEpisodeName(String episodeName) {
        this.episodeName = episodeName;
    }

    public int getEpisodeNumber() {
        return episodeNumber;
    }

    public void setEpisodeNumber(int episodeNumber) {
        this.episodeNumber = episodeNumber;
    }

    public String getSeasonName() {
        return seasonName;
    }

    public void setSeasonName(String seasonName) {
        this.seasonName = seasonName;
    }

    public int getSeasonNumber() {
        return seasonNumber;
    }

    public void setSeasonNumber(int seasonNumber) {
        this.seasonNumber = seasonNumber;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
