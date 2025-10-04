package USCLink.USCLink.controller;

import USCLink.USCLink.model.User;
import USCLink.USCLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.Set;

@RestController
@RequestMapping("users")
class UserController {
    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{username}")
    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
        try {
            return ResponseEntity.ok(userService.getCoincidentUsersByUsername(username).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Set<User>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }



    @PostMapping("/creation")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        try{
            user = userService.createUser(user.getUsername(), user.getEmail(), user.getTelephone());

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", user.getUsername()).build().toUri())
                    .body(user);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", user.getUsername()).build().toUri())
                    .build();
        }
    }
}

