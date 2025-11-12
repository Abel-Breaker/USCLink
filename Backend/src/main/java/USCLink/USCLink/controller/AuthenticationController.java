package USCLink.USCLink.controller;

import USCLink.USCLink.model.User;
import USCLink.USCLink.service.AuthenticationService;
import USCLink.USCLink.service.UserService;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import java.time.Duration;

@NullMarked
@RestController
@RequestMapping("auth")
public class AuthenticationController {
    private static final String REFRESH_TOKEN_COOKIE_NAME = "__Secure-RefreshToken";
    private final AuthenticationService authentication;
    private final UserService users;
    @Autowired
    public AuthenticationController(AuthenticationService authentication, UserService users) {
        this.authentication = authentication;
        this.users = users;
    }
    @PostMapping("login")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<Void> login(@RequestBody User user) {
        Authentication auth = authentication.login(user);
        String token = authentication.generateJWT(auth);
        String refreshToken = authentication.regenerateRefreshToken(auth);
        String refreshPath = MvcUriComponentsBuilder.fromMethodName(AuthenticationController.class, "refresh", "").build().toUri().getPath();
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                .secure(true)
                .httpOnly(true)
                .sameSite(Cookie.SameSite.STRICT.toString())
                .path(refreshPath)
                .maxAge(Duration.ofDays(7))
                .build();
        return ResponseEntity.noContent()
                .headers(headers -> headers.setBearerAuth(token))
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
    @PostMapping("register")
    @PreAuthorize("isAnonymous()")
    public ResponseEntity<User> register(@RequestBody User user) {
        User createdUser = users.createUser(user);
        return ResponseEntity.created(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", user.getUsername()).build().toUri())
                .body(createdUser);
    }
    @PostMapping("refresh")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> refresh(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME) String refreshToken) {
        Authentication auth = authentication.login(refreshToken);

        if (auth.getPrincipal() != null) {
            return login((User)auth.getPrincipal());
        }
        throw new Exception(refreshToken);
    }
    @PostMapping("logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(@RequestHeader(name = HttpHeaders.AUTHORIZATION) String token) {
        Authentication auth = authentication.parseJWT(token);
        if (auth.getPrincipal() != null) {
            User user = (User)auth.getPrincipal();
            authentication.invalidateTokens(user);
            ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, null).build();
            return ResponseEntity.noContent()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .build();
        }
        throw new RuntimeException("Internal Error");
    }
}