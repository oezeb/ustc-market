package com.github.oezeb.server.dto;

import lombok.Builder;

@Builder
public class RegisterRequest {
    public String name;
    public String email;
    public String password;
}