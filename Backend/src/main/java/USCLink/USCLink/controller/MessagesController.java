package USCLink.USCLink.controller;

import USCLink.USCLink.model.Message;
import USCLink.USCLink.service.MessagesService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.Instant;

@Tag(
    name = "Messages", 
    description = "Operations related to messaging between users" 
)
@RestController
@RequestMapping("/messages")
public class MessagesController {
    
    @Autowired
    MessagesService messageService;

    
    public MessagesController(MessagesService messageService) {
        this.messageService = messageService;
    }

    @Operation(
        summary = "Gets a list of messages in a chat, paginated",
        description = "Retrieves a paginated list of messages for a specific chat. Optional query parameters allow specifying page size and sorting."
    )
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public Page<Message> getMessages(
            @RequestParam Long chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sort) {

        return messageService.getMessagesByChatId(
                chatId,
                PageRequest.of(page, size, Sort.by(sort).ascending())
        );
    }

    @Operation(
        summary = "Sends a new message",
        description = "Sends a new message in a specific chat."
    )
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {

        message.setTimestamp(Instant.now().toString());

        messageService.sendMessage(message);
        return ResponseEntity.ok(message);
    }

    @Operation(
        summary = "Likes a specific message",
        description = "Allows a user to like a specific message by its ID."
    )
    @PostMapping("/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeMessage(@RequestParam Long messageId, @RequestParam String username) {
        messageService.addLikeToMessage(messageId, username);
        return ResponseEntity.ok().build();
    }

    @Operation(
        summary = "Unlikes a specific message",
        description = "Allows a user to remove their like from a specific message by its ID."
    )
    @DeleteMapping("/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeMessage(@RequestParam Long messageId, @RequestParam String username) {
        messageService.deleteLikeToMessage(messageId, username);
        return ResponseEntity.ok().build();
    }

}