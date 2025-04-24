package com.github.oezeb.server.controller;

import com.github.oezeb.server.dto.*;
import com.github.oezeb.server.entity.User;
import com.github.oezeb.server.exception.BadRequestException;
import com.github.oezeb.server.exception.ConflictException;
import com.github.oezeb.server.exception.ForbiddenException;
import com.github.oezeb.server.exception.UnauthorizedException;
import com.github.oezeb.server.service.JwtService;
import com.github.oezeb.server.service.MailService;
import com.github.oezeb.server.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    final JwtService jwtService;
    final UserService userService;
    final MailService mailService;
    final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody RegisterRequest registerRequest) {

        try {
            UserResponse userResponse = userService.createUser(UserRequest.builder()
                    .name(registerRequest.name)
                    .email(registerRequest.email)
                    .password(registerRequest.password)
                    .emailVerified(false)
                    .enabled(true)
                    .build());

            TokenResponse tokenResponse = jwtService.generateToken(userResponse);
            mailService.sendVerificationEmail(userResponse.email, userResponse.name, tokenResponse);


            return userResponse;
        } catch (DataIntegrityViolationException e) {
            throw  new ConflictException(registerRequest.email + " already has an account");
        }
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest loginRequest) {
        User user = userService.getUser(loginRequest.email);
        boolean passwordMatches = passwordEncoder.matches(loginRequest.password, user.getPassword());
        if (!user.isEnabled())
            throw new ForbiddenException("User account is disabled.");
        if (!user.isEmailVerified())
            throw new ForbiddenException("Email address not verified.");
        if (!passwordMatches)
            throw new UnauthorizedException("Invalid email or password.");
        return jwtService.generateToken(UserResponse.fromUser(user));
    }

    @GetMapping("/verify-email")
    public UserResponse verifyEmail(@RequestParam("token") String token) {
        UserResponse userResponse = jwtService.verifyToken(token);
        return userService.updateUser(userResponse.id, UserRequest.builder()
                .name(userResponse.name)
                .email(userResponse.email)
                .emailVerified(true)
                .enabled(userResponse.enabled)
                .build());
    }

    @PostMapping("/reset-password")
    public UserResponse resetPassword(@RequestBody ResetPasswordRequest request) {
        UserResponse userResponse = jwtService.verifyToken(request.token);
        return userService.updateUser(userResponse.id, UserRequest.builder()
                .name(userResponse.name)
                .email(userResponse.email)
                .password(request.newPassword)
                .emailVerified(userResponse.emailVerified)
                .enabled(userResponse.enabled)
                .build());
    }

    @PostMapping("/resend-verification")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resendVerification(@RequestBody EmailRequest request) {
        User user = userService.getUser(request.email);
        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified.");
        }

        TokenResponse tokenResponse = jwtService.generateToken(UserResponse.fromUser(user));
        mailService.sendVerificationEmail(user.getEmail(), user.getName(), tokenResponse);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(@RequestBody EmailRequest request) {
        User user = userService.getUser(request.email);
        if (!user.isEnabled() || !user.isEmailVerified()) {
            throw new BadRequestException("User account is disabled or Email is not verified.");
        }

        TokenResponse tokenResponse = jwtService.generateToken(UserResponse.fromUser(user));
        mailService.sendPasswordResetEmail(user, tokenResponse);
    }
}
