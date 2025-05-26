package com.example.RoleBasedAuth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RoleBasedAuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoleBasedAuthApplication.class, args);
	}

}
