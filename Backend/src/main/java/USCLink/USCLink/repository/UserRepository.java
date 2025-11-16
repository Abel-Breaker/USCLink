package USCLink.USCLink.repository;

import USCLink.USCLink.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
    // Buscar un usuario por username
    Set<User> findAllByUsername(String username);

    // Buscar un usuario por username
    Page<User> findAll(Pageable pageRequest);

    // Comprobar si existe un username
    boolean existsByUsername(String username);

    //
    Set<User> findByUsername(String username);

    
    @Query("SELECT u.username, u.avatar, u.biography FROM User u WHERE u.username NOT IN (SELECT f.user2.username FROM Follow f WHERE f.user1.username = ?1) AND u.username != ?1")
    Page<User> findAllByNotUsername(String username, Pageable pageRequest);

    // Comprobar si existe un username
    //Optional<User> existsByUsername(String username);
}
