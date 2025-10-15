package USCLink.USCLink.repository;

import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Follow;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.Set;

@Repository
public interface FollowRepository extends CrudRepository<Follow, Long> {

    // Buscar follows
    Page<Follow> findAll(Pageable pageRequest);

    // Comprobar si existe un username
    boolean existsById(Long id);

    // Buscar follows por id
    Set<Follow> findAllById(Long id);
}
