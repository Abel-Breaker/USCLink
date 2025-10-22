package USCLink.USCLink.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Check;

@Check(constraints = "user1_username <> user2_username")
@Entity
@Table(name = "Follow")
public class Follow {
    @EmbeddedId
    private FollowId id;

    @MapsId("user1Username")
    @ManyToOne
    @JoinColumn(name = "user1_username", referencedColumnName = "username")
    private User user1; // ID of the user who made the comment
    
    @MapsId("user2Username")
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
        this.id = new FollowId(user1.getUsername(), user2.getUsername());
        this.timestamp = java.time.Instant.now().toString();
    }

    public FollowId getId() {
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

    @PrePersist
    @PreUpdate
    private void validateDifferentUsers() {
        if (user1 != null && user2 != null) {
            String u1 = user1.getUsername();
            String u2 = user2.getUsername();
            if (u1 != null && u1.equals(u2)) {
                throw new IllegalArgumentException("user1 and user2 must be different users");
            }
        }
    }
}
