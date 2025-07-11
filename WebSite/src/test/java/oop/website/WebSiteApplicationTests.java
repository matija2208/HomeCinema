package oop.website;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class WebSiteApplicationTests {


    @Test
    void contextLoads() {
        final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        final String hashedPassword = encoder.encode("01061944");
        boolean isMatch = encoder.matches("01061944", "$2a$10$04gKzUyIA0UzHA4Ha8l/aOELHfwP3oXKv2t.vGSfw48l/zRp/8FW2");
        System.out.println("Match: " + isMatch); // Should print true
    }

}
