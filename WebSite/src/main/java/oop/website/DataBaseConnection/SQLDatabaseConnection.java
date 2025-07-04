package oop.website.DataBaseConnection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SQLDatabaseConnection {

    // Connect to your database.
    // Replace server name, username, and password with your credentials
    public static void connect() {
        String connectionUrl =
                "jdbc:sqlserver://localhost.database.windows.net:1433;"
                        + "database=HomeCinema;"
                        + "user=HomeCinemaApp;"
                        + "password=01061944;"
                        + "encrypt=true;"
                        + "trustServerCertificate=true;"
                        + "loginTimeout=30;";

        ResultSet resultSet = null;

        try (Connection connection = DriverManager.getConnection(connectionUrl);
             Statement statement = connection.createStatement();) {

            // Create and execute a SELECT SQL statement.
            System.out.println("Connected to database successfully");
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }
}