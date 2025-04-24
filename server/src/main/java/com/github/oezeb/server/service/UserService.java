package com.github.oezeb.server.service;

import com.github.oezeb.server.dto.UserRequest;
import com.github.oezeb.server.dto.UserResponse;
import com.github.oezeb.server.entity.User;
import com.github.oezeb.server.exception.NotFoundException;
import com.github.oezeb.server.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@AllArgsConstructor
public class UserService {
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;

    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("No user found with email: " + email));
    }

    public <T> T getUser(long id, Function<User, T> mapper) {
        return userRepository.findById(id).map(mapper)
                .orElseThrow(() -> new NotFoundException("No User found with id: " + id));
    }

    public UserResponse createUser(UserRequest userRequest) {
        return UserResponse.fromUser(userRepository.save(User.builder()
                .name(userRequest.name)
                .email(userRequest.email)
                .password(passwordEncoder.encode(userRequest.password))
                .emailVerified(userRequest.emailVerified)
                .enabled(userRequest.enabled)
                .build()));
    }

    public UserResponse updateUser(long id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No user found with id: " + id));
        user.setName(userRequest.name);
        if (userRequest.password != null)
            user.setPassword(passwordEncoder.encode(userRequest.password));
        user.setEmailVerified(userRequest.emailVerified);
        user.setEnabled(userRequest.enabled);
        return UserResponse.fromUser(userRepository.save(user));
    }
}
