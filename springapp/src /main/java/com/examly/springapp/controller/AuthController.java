
package com.examly.springapp.controller;

// import com.examly.springapp.dto.LoginUser;
import com.examly.springapp.model.RevokedToken;
// import com.examly.springapp.model.User;
import com.examly.springapp.model.Role;
import com.examly.springapp.repository.RevokedTokenRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import com.examly.springapp.dto.LoginDTO;
import com.examly.springapp.model.User;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists!");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        if (user.getRole() == null) {
            user.setRole(Role.ROLE_USER);
        }

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginUser) {
        String username = loginUser.getUsername();
        String password = loginUser.getPassword();

        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent() &&
                passwordEncoder.matches(password, existingUser.get().getPasswordHash())) {

            return ResponseEntity.ok(Map.of(
                "accessToken", jwtUtil.generateToken(
                        existingUser.get().getUsername(),
                        existingUser.get().getRole().name()
                ),
                "refreshToken", jwtUtil.generateRefreshToken(existingUser.get().getUsername())
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token,
                                         @RequestBody(required = false) Map<String, String> request) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            revokedTokenRepository.save(new RevokedToken(token));
        }

        if (request != null && request.containsKey("refreshToken")) {
            revokedTokenRepository.save(new RevokedToken(request.get("refreshToken")));
        }

        return ResponseEntity.ok("Logged out successfully.");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token.");
        }

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }

        User user = userOpt.get();

        return ResponseEntity.ok(Map.of(
                "accessToken", jwtUtil.generateToken(user.getUsername(), user.getRole().name())
        ));
    }
}
