package com.github.oezeb.server.dto;

import lombok.Builder;

@Builder
public class UserRequest {
    public String name;
    public String email;
    public String password;
    public Boolean emailVerified;
    public Boolean enabled;
}
