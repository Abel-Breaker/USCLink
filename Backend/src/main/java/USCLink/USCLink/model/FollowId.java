package USCLink.USCLink.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FollowId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "user1_username", nullable = false)
    private String user1Username;

    @Column(name = "user2_username", nullable = false)
    private String user2Username;

    public FollowId() {}

    public FollowId(String user1Username, String user2Username) {
        this.user1Username = user1Username;
        this.user2Username = user2Username;
    }

    public String getUser1Username() {
        return user1Username;
    }

    public void setUser1Username(String user1Username) {
        this.user1Username = user1Username;
    }

    public String getUser2Username() {
        return user2Username;
    }

    public void setUser2Username(String user2Username) {
        this.user2Username = user2Username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FollowId)) return false;
        FollowId that = (FollowId) o;
        return Objects.equals(user1Username, that.user1Username) &&
               Objects.equals(user2Username, that.user2Username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user1Username, user2Username);
    }
}