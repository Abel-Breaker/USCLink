package USCLink.USCLink.model;

import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "User")
public class User {
    @Id
    @Column(nullable = false, unique = true, length = 40)
    @Size(min = 1, max = 40)
    private String username;
    @Column(nullable = false, unique = true)
    @Size(min = 1, max = 40)
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "El correo electrónico debe tener un formato válido")
    private String email;
    @Column(nullable = false, unique = true)
    private Long telephone;
    @Column(nullable = false, unique = true)
    private String avatar;

    public User() {
    }

    public User(
            String username,
            String email,
            Long telephone,
            String fileName) {
        this.username = username;
        this.email = email;
        this.telephone = telephone;
        this.avatar = "./uploads/" + username + "/avatar/" + UUID.randomUUID().toString() + "_" + fileName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Long getTelephone() {
        return telephone;
    }
    
    public String getAvatar() {
        return avatar;
    }

    @Override
    public String toString() {
        return this.username; // devuelve el nombre de usuario
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return username != null && username.equals(user.getUsername());
    }
}
