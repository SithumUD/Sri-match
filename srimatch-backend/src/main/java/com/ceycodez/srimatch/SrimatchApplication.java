package com.ceycodez.srimatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SrimatchApplication {

	public static void main(String[] args) {
		SpringApplication.run(SrimatchApplication.class, args);
	}

}
