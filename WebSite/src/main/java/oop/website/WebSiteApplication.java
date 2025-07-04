package oop.website;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import oop.website.DataBaseConnection.SQLDatabaseConnection;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class WebSiteApplication {

    public static void main(String[] args) {
        SQLDatabaseConnection.connect();
        SpringApplication.run(WebSiteApplication.class, args);
    }
}