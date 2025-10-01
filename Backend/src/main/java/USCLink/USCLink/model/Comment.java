package USCLink.USCLink.model;

import jakarta.persistence.*;


@Entity
@Table(name = "Comment")
public class Comment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // ID of the user who made the comment

    @Column
    private Long postId; // ID of the post on which the comment was made

    @Column
    private String content;

    public Comment() {}

    public Comment(
            Long userId,
            Long postId,
            String email
    ) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
    }

    
}