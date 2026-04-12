package com.ceycodez.srimatch.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@Profile("dev")
public class FlywayRepairConfig {

    @Bean
    public CommandLineRunner repairFlyway(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                System.out.println("Attempting to manually repair flyway_schema_history...");
                jdbcTemplate.execute("DELETE FROM flyway_schema_history WHERE version = '5' AND success = 0");
                System.out.println("Successfully removed failed migration entry for version 5.");
            } catch (Exception e) {
                System.err.println("Could not repair flyway_schema_history: " + e.getMessage());
            }
        };
    }
}
