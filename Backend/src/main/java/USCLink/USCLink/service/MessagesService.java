package USCLink.USCLink.service;


import USCLink.USCLink.model.Message;
import USCLink.USCLink.repository.MessagesRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
public class MessagesService {

    @Autowired
    private MessagesRepository messageRepository;

    public MessagesService(MessagesRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Page<Message> getMessagesByChatId(Long chatId, Pageable pageable) {
        return messageRepository.findByChatId_Id(chatId, pageable);
    }

    public void sendMessage(Message message) {
        messageRepository.save(message);
    }
    
}