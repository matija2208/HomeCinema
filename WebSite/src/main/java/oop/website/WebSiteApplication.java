package oop.website;

import oop.website.Config.JwtKeyConfig;
import oop.website.Config.StorageConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtKeyConfig.class)
public class WebSiteApplication {

    public static void main(String[] args)
    {
        SpringApplication.run(WebSiteApplication.class, args);
    }

}
