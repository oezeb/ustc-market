package com.github.oezeb.server.controller;

import com.github.oezeb.server.dto.UserMinimalResponse;
import com.github.oezeb.server.dto.UserResponse;
import com.github.oezeb.server.service.JwtService;
import com.github.oezeb.server.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {
    final JwtService jwtService;
    final UserService userService;

    @GetMapping
    public UserResponse getUser(@AuthenticationPrincipal Jwt jwt) {
        return jwtService.verifyToken(jwt);
    }

    @GetMapping("/{id}")
    public UserMinimalResponse getUser(@PathVariable long id) {
        return userService.getUser(id, UserMinimalResponse::fromUser);
    }
}
