package USCLink.USCLink.model;

import java.util.Set;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;


@Entity
@Table(name = "User")
public class User  implements UserDetails {
    public interface Views {
        interface Public {}
        interface Private extends Public {}
    }

    @Id
    @Column(nullable = false, unique = true, length = 40)
    @Size(min = 1, max = 40)
    @JsonView(Views.Private.class)
    private String username;

    @Column(nullable = false, unique = false)
    @JsonView(Views.Private.class)
    private String password;

    @Column(nullable = false, unique = true)
    @Size(min = 1, max = 40)
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "El correo electrónico debe tener un formato válido")
    private String email;
    @Column(nullable = false, unique = true)
    private Long telephone;
    @Column(nullable = false, unique = true)
    private String avatar;
    @Column(nullable = false)
    @Size(min = 0, max = 256)
    private String biography;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "role"))
    @JsonView(Views.Private.class)
    private Set<Role> roles;

    public User() {
    }

    public User(
            String username,
            String password,
            String email,
            Long telephone,
            String fileName,
            String biography,
            Set<Role> roles) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.telephone = telephone;
        this.avatar = "./uploads/" + username + "/avatar/" + UUID.randomUUID().toString() + "_" + fileName;
        this.roles = roles;
        this.biography = biography;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_"+role.getRolename())).toList();
    }


    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
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
    public String getBiography() {
        return biography;
    }

    @Override
    public String toString() {
        return this.username; // devuelve el nombre de usuario
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public User setUsername(String username) {
        this.username = username;
        return this;
    }

    public User setPassword(String password) {
        this.password = password;
        return this;
    }

    public User setRoles(Set<Role> roles) {
        this.roles = roles;
        return this;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return username != null && username.equals(user.getUsername());
    }
}
