package oop.website.Models;

public class Movie extends File
{
    private String name;
    private int year;
    private String category;
    private String posterName;

    public Movie()
    {
        super();
        name=null;
        year=0;
        category =null;
    }

    public Movie(String name, int year, String category)
    {
        super();
        this.name = name;
        this.year = year;
        this.category = category;
    }

    public Movie(String name, int year, String category, String fileName)
    {
        super(fileName.split("\\.")[0],fileName.split("\\.")[1]);
        this.name = name;
        this.year = year;
        this.category = category;
    }

    public String  getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name = name;
    }
    public int getYear()
    {
        return year;
    }
    public void setYear(int year)
    {
        this.year = year;
    }
    public String getCategory()
    {
        return category;
    }
    public void setCategory(String category)
    {
        this.category = category;
    }
    public String getPosterName() {
        return posterName;
    }

    public void setPosterName(String posterName) {
        this.posterName = posterName;
    }

}
