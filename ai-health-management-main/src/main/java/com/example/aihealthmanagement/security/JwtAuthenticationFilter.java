package com.example.aihealthmanagement.security;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    /** 公开接口前缀，可按需增删 */
    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/auth/",          // /auth/login  /auth/register …
            "/v3/api-docs",    // swagger
            "/swagger-ui"      // swagger
    );

    /** 只有返回 false 时才会执行 doFilterInternal */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest req) {
        String path = req.getServletPath();
        // ① 预检请求直接放行（解决跨域 OPTIONS 被拦）
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            return true;
        }
        // ② 公开路径前缀直接放行
        return PUBLIC_PREFIXES.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // —— 下面逻辑只作用于真正需要鉴权的请求 ——
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new ServiceException(401, "Authorization header is missing or invalid");
            }

            String token = header.substring(7);
            if (!jwtTokenProvider.validateToken(token)) {
                throw new ServiceException(401, "Invalid or expired JWT token");
            }

            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            var userDetails = customUserDetailsService.loadUserById(userId);

            var auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);

            // 正常放行
            filterChain.doFilter(request, response);

        } catch (ServiceException ex) {
            // —— 统一 JSON 错误返回 —— //
            response.setStatus(ex.getCode());                       // 401 / 403 …
            response.setContentType("application/json;charset=UTF-8");

            // ServiceResponse 是你已有的统一返回包装类
            var body = com.example.aihealthmanagement.common.ServiceResponse
                    .error(ex.getCode(), ex.getMessage());

            // 用 Jackson 把对象序列化为 JSON
            String json = new com.fasterxml.jackson.databind.ObjectMapper()
                    .writeValueAsString(body);

            response.getWriter().write(json);
            // 不再调用 filterChain.doFilter，直接结束
        }
    }

}
