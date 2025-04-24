package com.github.oezeb.server.dto;

import lombok.Builder;

@Builder
public class TokenResponse {
    public String token;
    public String type;
    public Long expiration;
}
