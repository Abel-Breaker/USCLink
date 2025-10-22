package USCLink.USCLink.controller;

import USCLink.USCLink.model.Follow;
import USCLink.USCLink.model.FollowId;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.FollowService;
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
@RequestMapping("/follows")
public class FollowController {

    @Autowired
    FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @GetMapping("/")
    public ResponseEntity<Page<Follow>> getFollows(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagesize,
            @RequestParam(value = "sort", required = false, defaultValue = "") List<String> sort,
            @RequestParam(value = "followed", required = false) String followed,
            @RequestParam(value = "followedBy", required = false) String followedBy) {
        if (followed != null) {
            return ResponseEntity.ok(followService.getFollowsByFollowedUsername(followed, PageRequest.of(page, pagesize,
                    Sort.by("id"))));
        } else if (followedBy != null) {
            return ResponseEntity.ok(followService.getFollowsByFollowerUsername(followedBy, PageRequest.of(page, pagesize,
                    Sort.by("id"))));
        }        
        return ResponseEntity.ok(followService.getFollows(PageRequest.of(page, pagesize,
                Sort.by("id"))));
    }

    @GetMapping("{id}")
    public ResponseEntity<Follow> getFollow(@PathVariable("id") FollowId id) {
        try {
            return ResponseEntity.ok(followService.getCoincidentFollowsById(id).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<Follow> addFollow(@RequestBody Follow follow) {
        try {
            follow = followService.createFollow(follow.getUser1(), follow.getUser2());
            System.out.println("Comment created: " + follow.getId());

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(FollowController.class, "getFollow", follow.getId())
                            .build().toUri())
                    .body(follow);
        } catch (Exception e) {
            System.out.println("Error creating comment: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder
                            .fromMethodName(FollowController.class, "getFollow", follow.getId()).build().toUri())
                    .build();
        }
    }
}