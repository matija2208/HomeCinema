package oop.website.Models;

import oop.website.Config.JwtKeyConfig;
import oop.website.Utilities.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

public class User
{
    private String name;
    private String password;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void hashPassword()
    {
        password = oop.website.Utilities.PasswordUtils.hashPassword(password);
    }

    public boolean isPasswordEqual(String hashedPassword)
    {
        return oop.website.Utilities.PasswordUtils.checkPassword(password, hashedPassword);
    }
}
