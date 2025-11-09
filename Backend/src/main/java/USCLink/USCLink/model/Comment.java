package USCLink.USCLink.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "Comment")
public class Comment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_username", referencedColumnName = "username")
    private User user; // ID of the user who made the comment

    // Foreign key to Post.id
    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Post post; // ID of the post on which the comment was made

    @Column(nullable = false)
    private String timestamp; // Timestamp of when the comment was made

    @Column(nullable = false)
    @Size(min = 1, max = 200)
    private String content;

    @ManyToMany
    @JoinTable(
        name = "comment_like", // Intermediate table
        joinColumns = @JoinColumn(name = "comment_id"),
        inverseJoinColumns = @JoinColumn(name = "username")
    )
    private List<User> likes = new ArrayList<>();

    public Comment() {}

    public Comment(
            User user,
            Post post,
            String content
    ) {
        this.user = user;
        this.post = post;
        this.timestamp = java.time.Instant.now().toString();
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
    public Post getPost() {
        return post;
    }
    public String getContent() {
        return content;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public List<User> getLikes() {
        return likes;
    }
}