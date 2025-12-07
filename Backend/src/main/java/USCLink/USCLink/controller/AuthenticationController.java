package USCLink.USCLink.controller;

import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.AuthenticationService;
import USCLink.USCLink.service.UserService;
import USCLink.USCLink.repository.RoleRepository;
//import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.server.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import java.io.File;
import java.time.Duration;
import java.util.Set;

//@NullMarked
@Tag(
    name = "Authentication", 
    description = "Operations related to user authentication, including login, registration, token refresh, and logout." 
)
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

        @Operation(
                summary = "Logs in a user",
                description = "Authenticates a user with their username and password, returning a JWT token and setting a refresh token cookie."
        )
        @PostMapping("login")
        @PreAuthorize("isAnonymous()")
        public ResponseEntity<Void> login(@RequestBody User user) {
                System.out.println("Logging in user: " + user.getUsername() + " Duration:" + Duration.ofSeconds(10));
                Authentication auth = authentication.login(user);
                String token = authentication.generateJWT(auth);
                String refreshToken = authentication.regenerateRefreshToken(auth);
                String refreshPath = MvcUriComponentsBuilder
                                .fromMethodName(AuthenticationController.class, "refresh", "")
                                .build().toUri().getPath();
                ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshToken)
                                .secure(true) // Si esta a true, no se puede usar en HTTP
                                .httpOnly(true)
                                .sameSite(Cookie.SameSite.STRICT.toString())
                                .path(refreshPath)
                                .maxAge(Duration.ofDays(7))
                                .build();
                System.out.println(cookie.toString());
                return ResponseEntity.noContent()
                                .headers(headers -> headers.setBearerAuth(token))
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .build();
        }

        @Operation(
                summary = "Registers a new user",
                description = "Creates a new user account with the provided details and avatar image."
        )
        @PostMapping("register")
        @PreAuthorize("isAnonymous()")
        public ResponseEntity<User> register(@RequestParam("username") String username,
                        @RequestParam("password") String password, @RequestParam("email") String email,
                        @RequestParam("telephone") Long telephone, @RequestParam("avatar") MultipartFile avatar,
                        @RequestParam("biography") String biography) throws DuplicatedUserException, Exception {
                System.out.println("Registering user: " + username);
                User createdUser = users.createUser(username, password, email, telephone, avatar.getOriginalFilename(),
                                biography);
                String uploadsDir = createdUser.getAvatar();
                File destinationFile = new File(uploadsDir);
                destinationFile.getParentFile().mkdirs(); // crea los directorios padre si no existen
                System.out.println("Saving file to: " + destinationFile.getAbsolutePath());
                File absPath = new File(destinationFile.getAbsolutePath());
                // Save to the file system
                avatar.transferTo(absPath);
                System.out.println("User created: " + createdUser.getUsername());
                return ResponseEntity
                                .created(MvcUriComponentsBuilder
                                                .fromMethodName(UserController.class, "getUser", username).build()
                                                .toUri())
                                .body(createdUser);
        }

        @Operation(
                summary = "Refreshes JWT token",
                description = "Generates a new JWT token and refresh token using the provided refresh token cookie."
        )
        @PostMapping("refresh")
        @PreAuthorize("isAnonymous()")
        public ResponseEntity<Void> refresh(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME) String refreshToken)
                        throws Exception {
                Authentication auth = authentication.login(refreshToken);
                if (auth.getPrincipal() != null) {
                        String token = authentication.generateJWT(auth);
                        String refresh = authentication.regenerateRefreshToken(auth);
                        String refreshPath = MvcUriComponentsBuilder
                                        .fromMethodName(AuthenticationController.class, "refresh", "")
                                        .build().toUri().getPath();
                        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refresh)
                                        .secure(true) // Si esta a true, no se puede usar en HTTP
                                        .httpOnly(true)
                                        .sameSite(Cookie.SameSite.STRICT.toString())
                                        .path(refreshPath)
                                        .maxAge(Duration.ofDays(7))
                                        .build();
                        System.out.println(cookie.toString());
                        return ResponseEntity.noContent()
                                        .headers(headers -> headers.setBearerAuth(token))
                                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                        .build();
                }
                throw new Exception(refreshToken);
        }

        @Operation(
                summary = "Logs out a user",
                description = "Invalidates the user's tokens and clears the refresh token cookie."
        )
        @PostMapping("logout")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<Void> logout(@RequestHeader(name = HttpHeaders.AUTHORIZATION) String token) {
                System.out.println("Logging out with token: " + token);
                String jwtToken = token.substring(7);
                Authentication auth = authentication.parseJWT(jwtToken);
                System.out.println("Parsed authentication for user: " + auth);
                if (auth.getPrincipal() != null) {
                        User user = users.get((String) auth.getPrincipal());
                        authentication.invalidateTokens(user);
                        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, null).build();
                        return ResponseEntity.noContent()
                                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                        .build();
                }
                throw new RuntimeException("Internal Error");
        }
}