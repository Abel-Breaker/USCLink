package USCLink.USCLink.controller;

import USCLink.USCLink.model.Chat;
import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.Message;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.ChatService;
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
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/chat")
public class ChatController {
    
    @Autowired
    ChatService chatService;

    
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public Page<Chat> getChats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return chatService.getAllChats(PageRequest.of(page, size));
    }

}