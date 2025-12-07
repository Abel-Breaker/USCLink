package USCLink.USCLink.controller;

import USCLink.USCLink.model.Follow;
import USCLink.USCLink.model.FollowId;
import USCLink.USCLink.service.FollowService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;

@Tag(
    name = "Follows", 
    description = "Operations related to user follows, including creating and retrieving follow relationships." 
)
@RestController
@RequestMapping("/follows")
public class FollowController {

    @Autowired
    FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @Operation(
        summary = "Gets a list of follows, paginated",
        description = "Retrieves a paginated list of follow relationships. Optional query parameters allow filtering by followed or follower username."
    )
    @GetMapping
    @PreAuthorize("hasRole('USER')")
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

    @Operation(
        summary = "Gets a specific follow relationship",
        description = "Using the usernames of the follower and followed users, retrieves the corresponding follow relationship if it exists."
    )
    @GetMapping("{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Follow> getFollow(@PathVariable("user1") String user1,
            @PathVariable("user2") String user2) {
        try {
            return ResponseEntity.ok(followService.getCoincidentFollowsById(new FollowId(user1,user2)).iterator().next());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Creates a new follow relationship",
        description = "Creates a new follow relationship between two users."
    )
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Follow> addFollow(@RequestBody Follow follow) {
        try {
            follow = followService.createFollow(follow.getUser1(), follow.getUser2());
            System.out.println("Comment created: " + follow.getId());

            String user1 = follow.getId().getUser1Username();
            String user2 = follow.getId().getUser2Username();

            return ResponseEntity
                    .created(MvcUriComponentsBuilder.fromMethodName(FollowController.class, "getFollow", user1, user2)
                            .build().toUri())
                    .body(follow);
        } catch (Exception e) {
            System.out.println("Error creating comment: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .location(MvcUriComponentsBuilder
                            .fromMethodName(FollowController.class, "getFollow", follow.getId().getUser1Username(), follow.getId().getUser2Username()).build().toUri())
                    .build();
        }
    }
}