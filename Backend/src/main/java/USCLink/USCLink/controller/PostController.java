package USCLink.USCLink.controller;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.PostService;
import USCLink.USCLink.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Endpoint para subir archivo
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestPart("user") User user, @RequestPart("file") MultipartFile file) {
        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file was sent.");
            }

            // Create a new Post
            Post newPost = this.postService.createPost(user, file.getOriginalFilename());

            // Crear el archivo y su carpeta padre si no existen
            String uploadsDir = newPost.getPathToFile(); // Ruta en el frontend para que pueda acceder a la imagen
            File destinationFile = new File(uploadsDir);
            destinationFile.getParentFile().mkdirs(); // crea ./uploads/usuario si no existe

            System.out.println("Saving file to: " + destinationFile.getAbsolutePath());
            File absPath = new File(destinationFile.getAbsolutePath());
            // Save to the file system
            file.transferTo(absPath);

            return ResponseEntity.ok("File saved at: " + newPost.getPathToFile());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving file.");
        }
    }

    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort,
            @RequestParam(value = "followedBy", required = false, defaultValue = "") String followedBy,
            @RequestParam(value = "perfil", required = false, defaultValue = "") User perfil){
        if (!followedBy.isEmpty()) {
            return ResponseEntity.ok(postService.getPostsFollowedByUser(followedBy, PageRequest.of(page, pagesize,
                    Sort.by("id"))));
        }
        if (perfil != null) {
            return ResponseEntity.ok(postService.getPostsByUserUsername(perfil, PageRequest.of(page, pagesize,
                    Sort.by("id"))));
            
        }
        return ResponseEntity.ok(postService.getPosts(PageRequest.of(page, pagesize,
                Sort.by("id"))));
    }
}