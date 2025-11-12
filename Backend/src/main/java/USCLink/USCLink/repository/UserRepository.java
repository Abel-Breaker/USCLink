package USCLink.USCLink.repository;

import USCLink.USCLink.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


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

    // Comprobar si existe un username
    //Optional<User> existsByUsername(String username);
}
