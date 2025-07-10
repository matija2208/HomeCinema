package oop.website.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "files")
public class StorageConfig {
    private String path;

    public String getPath() {
        return path;
    }
    public void setPath(String path)
    {
        this.path = path;
    }

    @Override
    public String toString() {return (path==null)?"null":path;}
}