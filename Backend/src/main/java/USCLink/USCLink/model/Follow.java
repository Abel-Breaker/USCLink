package USCLink.USCLink.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Follow")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user1_username", referencedColumnName = "username")
    private User user1; // ID of the user who made the comment
    @ManyToOne
    @JoinColumn(name = "user2_username", referencedColumnName = "username")
    private User user2; // ID of the user who made the comment
    @Column(nullable = false)
    private String timestamp; // Timestamp of when the comment was made

    public Follow() {
    }

    public Follow(
            User user1,
            User user2) {
        this.user1 = user1;
        this.user2 = user2;
        this.timestamp = java.time.Instant.now().toString();
    }

    public Long getId() {
        return id;
    }

    public User getUser1() {
        return user1;
    }

    public User getUser2() {
        return user2;
    }

    public String getTimeStamp() {
        return timestamp;
    }
}
