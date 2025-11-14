package USCLink.USCLink.filter;

import USCLink.USCLink.service.AuthenticationService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
//import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {
    private final AuthenticationService authenticationService;

    @Autowired
    public JWTFilter( AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilterInternal(
            /*@NonNull*/ HttpServletRequest request,
            /*@NonNull*/ HttpServletResponse response,
            /*@NonNull*/ FilterChain chain
    ) throws ServletException, IOException, JwtException {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(token == null || !token.startsWith("Bearer ")){
            chain.doFilter(request, response);
            return;
        }

        Authentication authentication = authenticationService.parseJWT(token.replaceFirst("^Bearer ", ""));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        chain.doFilter(request, response);
    }
}
