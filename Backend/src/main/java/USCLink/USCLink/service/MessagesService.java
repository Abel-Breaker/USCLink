package USCLink.USCLink.service;


import USCLink.USCLink.model.Message;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.MessagesRepository;
import USCLink.USCLink.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class MessagesService {

    @Autowired
    private MessagesRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public MessagesService(MessagesRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Page<Message> getMessagesByChatId(Long chatId, Pageable pageable) {
        return messageRepository.findByChatId_Id(chatId, pageable);
    }

    public void sendMessage(Message message) {
        messageRepository.save(message);
    }

    public void addLikeToMessage(Long messageId, String username) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        
        User user = userRepository.findById(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        message.addLike(user);
        messageRepository.save(message);
    }

    public void deleteLikeToMessage(Long messageId, String username) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        
        User user = userRepository.findById(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        message.removeLike(user);
        messageRepository.save(message);
    }
    
}