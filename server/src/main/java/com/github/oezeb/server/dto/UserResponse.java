package com.github.oezeb.server.dto;

import com.github.oezeb.server.entity.User;
import lombok.Builder;

@Builder
public class UserResponse {
    public Long id;
    public String name;
    public String email;
    public Boolean emailVerified;
    public Boolean enabled;

    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .enabled(user.isEnabled())
                .build();
    }
}
