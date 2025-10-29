package USCLink.USCLink.service;

import USCLink.USCLink.model.Chat;
import USCLink.USCLink.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public Page<Chat> getAllChatsFromUser(String username, Pageable pageable) {
        return chatRepository.findByUsers_Username(username, pageable);
    }
    
}