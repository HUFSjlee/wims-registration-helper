package com.wims.server.infrastructure.web;

import org.springframework.stereotype.Component;

@Component
public class AuthHeaderTokenResolver {
    public String resolve(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return "";
        }
        if (authorizationHeader.toLowerCase().startsWith("bearer ")) {
            return authorizationHeader.substring(7).trim();
        }
        return authorizationHeader.trim();
    }
}
