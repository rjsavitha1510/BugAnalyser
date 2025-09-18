package com.examly.springapp.repository;

import com.examly.springapp.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {

    default boolean isTokenRevoked(String token) {
        return existsById(token);
    }

    default void saveToken(String token) {
        save(new RevokedToken(token));
    }
}
