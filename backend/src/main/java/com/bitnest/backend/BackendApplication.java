package com.bitnest.backend;

import com.bitnest.backend.utils.SystemChecker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SystemChecker.initialize();

		SpringApplication.run(BackendApplication.class, args);

	}

}
