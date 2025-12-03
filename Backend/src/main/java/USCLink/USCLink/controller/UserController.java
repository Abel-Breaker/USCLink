package USCLink.USCLink.controller;

import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Role;
import USCLink.USCLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import USCLink.USCLink.repository.RoleRepository;
import org.springframework.security.access.prepost.PreAuthorize;


import java.util.Set;
import java.io.File;
import java.util.List;

@RestController
@RequestMapping("users")
class UserController {

    @Autowired
    UserService userService;
    RoleRepository roleRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{username}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getUser(@PathVariable("username") String username) {
        try {
            return ResponseEntity.ok(userService.getCoincidentUsersByUsername(username).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<User>> getUsers(@RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort,
            @RequestParam(value = "user", required = false) String user
) {
    if (user!=null) {
        return ResponseEntity.ok(userService.getUsersByUsernameNotContaining(user, PageRequest.of(page, pagesize,
                Sort.by("username"))));
    }
        return ResponseEntity.ok(userService.getUsers(PageRequest.of(page, pagesize,
                Sort.by("username"))));
    }



    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> addUser(@RequestParam("username") String username, @RequestParam("password") String password, @RequestParam("email") String email, @RequestParam("telephone") Long telephone, @RequestParam("avatar") MultipartFile avatar, @RequestParam("biography") String biography) throws DuplicatedUserException, RuntimeException {
        try{
            User userObj = userService.createUser(username, password, email, telephone, avatar.getOriginalFilename(), biography);
            String uploadsDir = userObj.getAvatar();
            File destinationFile = new File(uploadsDir);
            destinationFile.getParentFile().mkdirs(); // crea los directorios padre si no existen
            System.out.println("Saving file to: " + destinationFile.getAbsolutePath());
            File absPath = new File(destinationFile.getAbsolutePath());
            // Save to the file system
            avatar.transferTo(absPath);
            System.out.println("User created: " + userObj.getUsername());

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", userObj.getUsername()).build().toUri())
                    .body(userObj);
        }catch (Exception e) {
            System.out.println("Error creating user: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", username).build().toUri())
                    .build();
        }
    }

    @DeleteMapping("{username}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteUser(@PathVariable("username") String username) {
        try {
            userService.deleteUser(username);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

