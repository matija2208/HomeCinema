package oop.website.Models;

import java.util.UUID;

public abstract class File
{
    private String fileName;

    public File()
    {
        fileName =null;
    }

    public File(String extension) {
        fileName = UUID.randomUUID().toString() + extension;
    }

    public File(String fileName, String extension) {
        this.fileName = fileName +extension;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String fileName)
    {
        this.fileName = fileName;
    }
}
