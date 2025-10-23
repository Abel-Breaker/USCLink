package USCLink.USCLink.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "Chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Size(min = 1, max = 40)
    private String nameChat;

    @ManyToMany
    @JoinTable(
        name = "chat_user", // Intermediate table
        joinColumns = @JoinColumn(name = "chat_id"),
        inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<User> users = new ArrayList<>();

    @Column(nullable = false)
    private String timestamp; // Timestamp of when the chat was created


    public Chat() {}

    public Chat(String nameChat, List<User> users) 
    {
        this.nameChat = nameChat;
        this.users = users;
        this.timestamp = java.time.Instant.now().toString();
    }
    public Chat(List<User> users) 
    {
        // Convierte cada User a string y los une con coma
        this.nameChat = users.stream()
                             .map(User::toString)
                             .collect(Collectors.joining(", "));
        this.users = users;
        this.timestamp = java.time.Instant.now().toString();
    }

    public Long getId() 
    {
        return id;
    }

    public String getNameChat() {
        return nameChat;
    }

    public List<User> getUsers() {
        return users;
    }
    public String getTimestamp()
    {
        return timestamp;
    }
    
}
