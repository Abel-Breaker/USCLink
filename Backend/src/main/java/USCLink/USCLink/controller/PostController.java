package USCLink.USCLink.controller;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.PostService;
import USCLink.utils.patch.JsonPatchOperation;
import USCLink.utils.patch.exception.JsonPatchFailedException;
import USCLink.USCLink.exception.FileNotSavedException;
import USCLink.USCLink.exception.PostNotFoundException;
import USCLink.USCLink.exception.AccessDeniedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.io.File;
import java.io.IOException;
import java.util.List;

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
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> uploadFile(@RequestPart("user") User user, @RequestPart("file") MultipartFile file,
            @RequestPart(value = "caption", required = false) String caption) throws FileNotSavedException {
        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No file was sent.");
            }

            // Create a new Post
            Post newPost = this.postService.createPost(user, file.getOriginalFilename(), caption);

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
            throw new FileNotSavedException(file.getOriginalFilename());
        }
    }

    @GetMapping(headers = "API-Version=v1")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort,
            @RequestParam(value = "followedBy", required = false, defaultValue = "") String followedBy,
            @RequestParam(value = "perfil", required = false, defaultValue = "") User perfil) {
        if (!followedBy.isEmpty()) {
            return ResponseEntity.ok(postService.getPostsFollowedByUser(followedBy, PageRequest.of(page, pagesize,
                    Sort.by("timestamp").descending())));
        }
        if (perfil != null) {
            return ResponseEntity.ok(postService.getPostsByUserUsername(perfil, PageRequest.of(page, pagesize,
                    Sort.by("timestamp").descending())));

        }
        return ResponseEntity.ok(postService.getPosts(PageRequest.of(page, pagesize,
                Sort.by("timestamp").descending())));
    }

    @GetMapping(headers = "API-Version=v2")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<Post>> getPostsAscending(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort,
            @RequestParam(value = "followedBy", required = false, defaultValue = "") String followedBy,
            @RequestParam(value = "perfil", required = false, defaultValue = "") User perfil) {
        if (!followedBy.isEmpty()) {
            return ResponseEntity.ok(postService.getPostsFollowedByUser(followedBy, PageRequest.of(page, pagesize,
                    Sort.by("timestamp").ascending())));
        }
        if (perfil != null) {
            return ResponseEntity.ok(postService.getPostsByUserUsername(perfil, PageRequest.of(page, pagesize,
                    Sort.by("timestamp").ascending())));

        }
        return ResponseEntity.ok(postService.getPosts(PageRequest.of(page, pagesize,
                Sort.by("timestamp").ascending())));
    }

    @GetMapping("{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Post> getPost(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(postService.getCoincidentPostsById(id).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/likes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> likePost(@PathVariable("id") Long post, @RequestBody User user) {
        System.out.println("User " + user.getUsername() + " is liking post ID " + post);
        this.postService.likePost(post, user);
        return ResponseEntity.ok("Post liked successfully.");
    }

    @DeleteMapping("/{id}/likes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> dislikePost(@PathVariable("id") Long post, @RequestBody User user) {
        System.out.println("User " + user.getUsername() + " is disliking post ID " + post);
        this.postService.dislikePost(post, user);
        return ResponseEntity.ok("Post disliked successfully.");
    }

    @PatchMapping("{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Post> updatePost(@PathVariable("id") Long id, @RequestBody List<JsonPatchOperation> changes, Authentication authentication)
            throws FileNotSavedException, JsonPatchFailedException, AccessDeniedException {
        try {
            if (!postService.getCoincidentPostsById(id).iterator().next().getUser().getUsername().equals(authentication.getName())) {
                throw new AccessDeniedException(authentication.getName());
            }
            return ResponseEntity.ok(postService.updatePost(id, changes));
        } catch (PostNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deletePost(@PathVariable("id") Long id, Authentication authentication)
            throws PostNotFoundException, AccessDeniedException {
                System.out.println("Deleting post ID " + id);
        Post post = postService.getCoincidentPostsById(id).iterator().next();
        if (post == null) {
            throw new PostNotFoundException(id);
        }
        if (!post.getUser().getUsername().equals(authentication.getName())) {
          throw new AccessDeniedException(authentication.getName());
        }
        String deleteDir = post.getPathToFile();
        File deleteFile = new File(deleteDir);
        if (deleteFile.delete()) {
            System.out.println("Deleted file: " + deleteDir);
        } else {
            System.out.println("Failed to delete file: " + deleteDir);
        }
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

}