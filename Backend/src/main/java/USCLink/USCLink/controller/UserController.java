package USCLink.USCLink.controller;

import USCLink.USCLink.model.User;
import USCLink.USCLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


import java.util.Set;
import java.util.List;

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

    @GetMapping("/")
    public ResponseEntity<Page<User>> getUsers(@RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort
) {
        return ResponseEntity.ok(userService.getUsers(PageRequest.of(page, pagesize,
                Sort.by("username"))));
    }



    @PostMapping("/")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        try{
            user = userService.createUser(user.getUsername(), user.getEmail(), user.getTelephone());
            System.out.println("User created: " + user.getUsername());

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", user.getUsername()).build().toUri())
                    .body(user);
        } catch (Exception e) {
            System.out.println("Error creating user: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", user.getUsername()).build().toUri())
                    .build();
        }
    }
}

