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

import java.time.Instant;

@RestController
@RequestMapping("/messages")
public class MessagesController {
    
    @Autowired
    MessagesService messageService;

    
    public MessagesController(MessagesService messageService) {
        this.messageService = messageService;
    }

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

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {

        message.setTimestamp(Instant.now().toString());

        messageService.sendMessage(message);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeMessage(@RequestParam Long messageId, @RequestParam String username) {
        messageService.addLikeToMessage(messageId, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeMessage(@RequestParam Long messageId, @RequestParam String username) {
        messageService.deleteLikeToMessage(messageId, username);
        return ResponseEntity.ok().build();
    }

}