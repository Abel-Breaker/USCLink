package USCLink.USCLink.controller;

import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.CommentService;
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
@RequestMapping("/comments")
public class CommentController {
    
    @Autowired
    CommentService commentService;

    
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<Comment>> getComments(@RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort
) {
        return ResponseEntity.ok(commentService.getComments(PageRequest.of(page, pagesize,
                Sort.by("id"))));
    }

    @GetMapping("{id}")
    public ResponseEntity<Comment> getComment(@PathVariable("id") Long id) {
        try {
            return ResponseEntity.ok(commentService.getCoincidentCommentsById(id).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        try{
            comment = commentService.createComment(comment.getUser(), comment.getPost(), comment.getContent());
            System.out.println("Comment created: " + comment.getId());

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(CommentController.class, "getComment", comment.getId()).build().toUri())
                    .body(comment);
        } catch (Exception e) {
            System.out.println("Error creating comment: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder.fromMethodName(CommentController.class, "getComment", comment.getId()).build().toUri())
                    .build();
        }
    }
}