package USCLink.USCLink.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Post")
public class Post
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false)
    private String pathToFile;


    public Post(Long id, String pathToFile) 
    {
        this.id = id;
        this.pathToFile = pathToFile;
    }

    public Long getId() 
    {
        return id;
    }

    public void setId(Long id) 
    {
        this.id = id;
    }

    public String getpathToFile() 
    {
        return pathToFile;
    }

    public void setpathToFile(String pathToFile) 
    {
        this.pathToFile = pathToFile;
    }
}

