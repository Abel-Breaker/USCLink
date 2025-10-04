package USCLink.USCLink.repository;

import USCLink.USCLink.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    // Buscar un usuario por username
    Set<User> findAllByUsername(String username);

    // Buscar un usuario por username
    Set<User> findAll();

    // Comprobar si existe un username
    boolean existsByUsername(String username);

    // Comprobar si existe un username
    //Optional<User> existsByUsername(String username);
}
