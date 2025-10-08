package USCLink.USCLink.model;

import jakarta.persistence.*;

@Entity
@Table(name = "User")
public class User
{
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private Long telephone;

    public User() {}

    public User(
            String username,
            String email,
            Long telephone
    ) {
        this.username = username;
        this.email = email;
        this.telephone = telephone;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTelephone() {
        return telephone;
    }

    public void setTelephone(Long telephone) {
        this.telephone = telephone;
    }
}

