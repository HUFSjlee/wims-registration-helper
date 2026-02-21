package com.wims.server.infrastructure.security;

import com.wims.server.application.port.TokenGenerator;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UuidTokenGenerator implements TokenGenerator {
    @Override
    public String nextToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
