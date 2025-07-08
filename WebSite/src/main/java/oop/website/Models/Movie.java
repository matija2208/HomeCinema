package oop.website.Models;

import java.util.UUID;

public class Movie extends File
{
    private String name;
    private int year;
    private String catagory;

    public Movie()
    {
        super();
        name=null;
        year=0;
        catagory=null;
    }

    public Movie(String name, int year, String catagory)
    {
        super();
        this.name = name;
        this.year = year;
        this.catagory = catagory;
    }

    public Movie(String name, int year, String catagory, String fileName)
    {

        super(fileName.split("\\.")[0],fileName.split("\\.")[1]);
        this.name = name;
        this.year = year;
        this.catagory = catagory;
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
    public String getCatagory()
    {
        return catagory;
    }
    public void setCatagory(String catagory)
    {
        this.catagory = catagory;
    }
}
