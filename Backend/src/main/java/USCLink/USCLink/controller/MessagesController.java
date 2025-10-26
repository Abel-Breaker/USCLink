package USCLink.USCLink.controller;

import USCLink.USCLink.model.Chat;
import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.Message;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.ChatRepository;
import USCLink.USCLink.repository.MessagesRepository;
import USCLink.USCLink.repository.UserRepository;
import USCLink.USCLink.service.CommentService;
import USCLink.USCLink.service.PostService;
import USCLink.USCLink.service.UserService;
import USCLink.USCLink.service.MessagesService;

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
import java.time.Instant;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/messages")
public class MessagesController {
    
    @Autowired
    MessagesService messageService;

    
    public MessagesController(MessagesService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
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
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {

        message.setTimestamp(Instant.now().toString());

        messageService.sendMessage(message);
        return ResponseEntity.ok(message);
    }

}