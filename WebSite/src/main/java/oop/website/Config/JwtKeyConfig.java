package oop.website.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="jwt")
public class JwtKeyConfig
{
    private String key;

    public String getKey() {
        return key;
    }
    public void setKey(String key)
    {
        this.key = key;
    }
}
