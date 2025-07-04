package oop.website.Models;

import java.util.UUID;

public abstract class File
{
    private UUID filename;
    private String extension;

    public File()
    {
        filename=null;
        extension=null;
    }

    public File(String extension)
    {
        filename = UUID.randomUUID();
        this.extension = extension;
    }

    public File(UUID filename, String extension)
    {
        this.filename = filename;
        this.extension = extension;
    }

    public String getFileName()
    {
        return filename.toString() + extension;
    }

    public void setFilename(UUID filename)
    {
        this.filename = filename;
    }

    public void setExtension(String extension)
    {
        this.extension = extension;
    }
}
