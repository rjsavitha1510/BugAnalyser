package com.examly.springapp.dto;

import com.examly.springapp.model.Role;

public class UserDTO {
    private String username;
    private String email;
    private Role role;
    private String password; 

    public UserDTO() {}

    public UserDTO(String username, String email, Role role, String password) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
