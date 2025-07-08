package oop.website.Models;

import java.util.UUID;

public abstract class File
{
    private String filename;
    private String extension;

    public File()
    {
        filename=null;
        extension=null;
    }

    public File(String extension)
    {
        filename = UUID.randomUUID().toString();
        this.extension = extension;
    }

    public File(String filename, String extension)
    {
        this.filename = filename;
        this.extension = extension;
    }

    public String getFileName()
    {
        return filename.toString() + extension;
    }

    public void setFilename(String filename)
    {
        this.filename = filename;
    }

    public void setExtension(String extension)
    {
        this.extension = extension;
    }
}
