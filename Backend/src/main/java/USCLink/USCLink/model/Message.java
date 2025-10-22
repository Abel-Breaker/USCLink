package USCLink.USCLink.model;

import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Message")
public class Message {

    @Id
    @JoinColumn(referencedColumnName = "id")
    private Chat chat_id;

    @ManyToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private User sender;

    @Column(nullable = false)
    @Size(min = 1, max = 512)
    private String messageContent;

    @Column(nullable = false)
    private String timestamp; // Timestamp of when the message was sent


    public Message(User sender, String messageContent) 
    {
        this.sender = sender;
        this.messageContent = messageContent;
        this.timestamp = java.time.Instant.now().toString();
    }

    public Chat getChat_id() 
    {
        return chat_id;
    }
    public User getSender() 
    {
        return sender;
    }
    public String getMessageContent() 
    {
        return messageContent;
    }
    public String getTimestamp() 
    {
        return timestamp;
    }
    
}
