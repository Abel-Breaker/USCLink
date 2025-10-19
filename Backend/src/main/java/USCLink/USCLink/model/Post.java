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

    //TODO: Agregar fecha de creación y contenido de texto

    public Post() {}

    public Post(User user, String fileName) 
    {
        this.user = user;
        this.pathToFile = "./uploads/" + user.getUsername() + "/" + UUID.randomUUID().toString() + "_" + fileName;
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
}

