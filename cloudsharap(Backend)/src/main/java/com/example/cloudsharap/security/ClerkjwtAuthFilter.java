package com.example.cloudsharap.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class ClerkjwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ ใช้ servletPath (ตัด context-path ออกแล้ว)
        String path = request.getServletPath();

        // ✅ ปล่อย OPTIONS ผ่าน (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ ปล่อย PUBLIC / DOWNLOAD / WEBHOOK ผ่าน โดยไม่ต้องมี token
        if (path.startsWith("/webhooks/")
                || path.startsWith("/files/public/")
                || path.startsWith("/files/download/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(">>> ClerkjwtAuthFilter: Missing or invalid Authorization header for "
                    + request.getMethod() + " " + request.getRequestURI());
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "Authorization header missing/invalid token");
            return;
        }

        String token = authHeader.substring(7);

        try {
            String[] chunks = token.split("\\.");
            if (chunks.length < 3) {
                System.out.println(">>> ClerkjwtAuthFilter: Invalid JWT format");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT token format");
                return;
            }

            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode headerNode = mapper.readTree(headerJson);

            if (!headerNode.has("kid")) {
                System.out.println(">>> ClerkjwtAuthFilter: Missing kid in header");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token header is missing kid");
                return;
            }
            String kid = headerNode.get("kid").asText();

            PublicKey publicKey = jwksProvider.getPublicKey(kid);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .setAllowedClockSkewSeconds(60)
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String clerkId = claims.getSubject();
            System.out.println(">>> ClerkjwtAuthFilter: Authenticated clerkId = " + clerkId +
                    " for " + request.getMethod() + " " + request.getRequestURI());

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            clerkId,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            System.out.println(">>> ClerkjwtAuthFilter: Invalid JWT token: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "Invalid JWT token: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}