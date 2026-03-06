package com.crossfitkorea;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.data.redis.host=localhost",
    "spring.data.redis.port=6379",
    "jwt.secret=test-secret-key-must-be-at-least-256-bits-long-for-hs256"
})
class CrossfitkoreaApplicationTests {

    @Test
    void contextLoads() {
    }
}
