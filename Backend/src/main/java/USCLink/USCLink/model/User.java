package USCLink.USCLink.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

    public User() {
    }

    public User(
            String username,
            String email,
            Long telephone) {
        this.username = username;
        this.email = email;
        this.telephone = telephone;
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
}
