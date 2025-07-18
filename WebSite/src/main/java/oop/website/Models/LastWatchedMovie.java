package oop.website.Models;

public class LastWatchedMovie extends Movie
{
    private String lastWatched;
    private String timeStamp;

    public LastWatchedMovie()
    {
        lastWatched = null;
        timeStamp = null;
    }

    public String getLastWatched() {
        return lastWatched;
    }

    public void setLastWatched(String lastWatched) {
        this.lastWatched = lastWatched;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }
}
