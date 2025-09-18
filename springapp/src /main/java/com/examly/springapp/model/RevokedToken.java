package com.examly.springapp.model;


import lombok.*;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevokedToken {
    @Id
    private String token;
    private Date revokedAt;

    public RevokedToken(String token) {
        this.token = token;
        this.revokedAt = new Date();
    }
}
