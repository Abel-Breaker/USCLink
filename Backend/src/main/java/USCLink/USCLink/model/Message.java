package USCLink.USCLink.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Message")
public class Message {

    // TODO: De verdad un ID para cada mensaje?
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "id")
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private User sender;

    @Column(nullable = false)
    @Size(min = 1, max = 512)
    private String messageContent;

    @Column(nullable = false)
    private String timestamp; // Timestamp of when the message was sent

    @ManyToMany
    @JoinTable(
        name = "message_likes", // Intermediate table
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<User> users = new ArrayList<>();


    public Message() {}

    public Message(User sender, String messageContent) 
    {
        this.sender = sender;
        this.messageContent = messageContent;
        this.timestamp = java.time.Instant.now().toString();
    }

    public Message(Chat chat, User sender, String messageContent) 
    {
        this.chat = chat;
        this.sender = sender;
        this.messageContent = messageContent;
        this.timestamp = java.time.Instant.now().toString();
    }

    public Long getId() 
    {
        return id;
    }
    public Chat getChat() 
    {
        return chat;
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

    public void setChat(Chat chat) 
    {
        this.chat = chat;
    }
    public void setSender(User sender) 
    {
        this.sender = sender;   

    }
    public void setMessageContent(String messageContent) 
    {
        this.messageContent = messageContent;
    }
    public void setTimestamp(String timestamp)
    {
        this.timestamp = timestamp;
    }
    public void addLike(User user) {
        if (user == null) return;
        if (!users.contains(user)) {
            users.add(user);
        }
    }

    public void removeLike(User user) {
        users.remove(user);
    }

    public boolean hasLike(User user) {
        return users.contains(user);
    }
    public List<User> getUsers() {
        return users;
    }
    public void setUsers(List<User> users) {
        this.users = users;
    }
}
