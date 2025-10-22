package USCLink.USCLink.service;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Chat;
import USCLink.USCLink.model.Message;
import USCLink.USCLink.repository.PostRepository;
import USCLink.USCLink.repository.UserRepository;
import USCLink.USCLink.repository.ChatRepository;
import USCLink.USCLink.repository.MessagesRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public Page<Chat> getAllChats(Pageable pageable) {
        return chatRepository.findAll(pageable);
    }
    
}