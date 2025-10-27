package USCLink.USCLink.model;

import java.util.UUID;

import jakarta.persistence.*;

@Entity
@Table(name = "Post")
public class Post
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to User.username
    @ManyToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private User user;

    @Column(nullable = false, unique = true)
    private String pathToFile;

    @Column(nullable = true, length = 500)
    private String caption;

    @Column(nullable = false)
    private String timestamp; // Timestamp of when the message was sent

    //TODO: Agregar fecha de creación y contenido de texto

    public Post() {}

    public Post(User user, String fileName, String caption)
    {
        this.user = user;
        this.pathToFile = "./uploads/" + user.getUsername() + "/" + UUID.randomUUID().toString() + "_" + fileName;
        this.timestamp = java.time.Instant.now().toString();
        this.caption = caption;
    }

    public Long getId() 
    {
        return id;
    }

    public User getUser() 
    {
        return user;
    }

    public String getPathToFile() 
    {
        return pathToFile;
    }
    public String getCaption() 
    {
        return caption;
    }
    public String getTimestamp() 
    {
        return timestamp;
    }
}

