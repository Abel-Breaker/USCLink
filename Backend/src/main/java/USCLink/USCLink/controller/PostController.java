package USCLink.USCLink.controller;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.PostService;
import USCLink.USCLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.util.Set;

@RestController
@RequestMapping("/files")
public class PostController {

    PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Endpoint para subir archivo
    @PostMapping("/")
    public ResponseEntity<String> uploadFile(@RequestBody User user, @RequestParam("file") MultipartFile file) {
        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file was sent.");
            }

            // Create a new Post
            Post newPost = this.postService.createPost(user, file.getOriginalFilename());


            // Save to the file system
            file.transferTo(new File(newPost.getpathToFile()));

            return ResponseEntity.ok("File saved at: " + newPost.getpathToFile());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving file.");
        }
    }
}