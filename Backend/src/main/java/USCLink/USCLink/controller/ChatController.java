package USCLink.USCLink.controller;

import USCLink.USCLink.model.Chat;
import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.User;
import USCLink.USCLink.service.ChatService;
import USCLink.USCLink.service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    ChatService chatService;
    UserService userService;

    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public Page<Chat> getChats(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return chatService.getAllChatsFromUser(username, PageRequest.of(page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createGroup(@RequestParam String nameChat, @RequestParam List<String> users) {
        try {
            System.out.println("HOLA!");
            List<User> userList = new java.util.ArrayList<>();
            for (String user : users) {
                userList.add(userService.getCoincidentUsersByUsername(user).iterator().next());
            }
            System.out.println("HOLA2!");
            Chat chat;
            if(nameChat == null || nameChat.isEmpty()){
                chat = new Chat(userList);
            }
            else{
                chat = new Chat(nameChat, userList);
            }
            System.out.println("HOLA3!");
            
            // Guardar en DB
            chatService.createChat(chat);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("Error creating group: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating group: " + e.getMessage());
        }
    }
}