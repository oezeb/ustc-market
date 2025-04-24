package com.github.oezeb.server.dto;

import com.github.oezeb.server.entity.User;
import lombok.Builder;

@Builder
public class UserMinimalResponse {
    public Long id;
    public String name;

    public static UserMinimalResponse fromUser(User user) {
        return UserMinimalResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .build();
    }
}
