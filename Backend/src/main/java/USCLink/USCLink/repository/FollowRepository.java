package USCLink.USCLink.repository;

import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Follow;
import USCLink.USCLink.model.FollowId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.Set;

@Repository
public interface FollowRepository extends CrudRepository<Follow, FollowId> {

    // Buscar follows
    Page<Follow> findAll(Pageable pageRequest);

    // Comprobar si existe un username
    boolean existsById(FollowId id);

    // Buscar follows por id
    Set<Follow> findAllById(FollowId id);

    // Buscar follows por el username del usuario seguido
    @Query("SELECT f FROM Follow f WHERE f.user2.username = ?1")
    Page<Follow> findAllByFollowedUsername(String username, Pageable pageRequest);

    // Buscar follows por el username del usuario seguidor
    @Query("SELECT f FROM Follow f WHERE f.user1.username = ?1")
    Page<Follow> findAllByFollowerUsername(String username, Pageable pageRequest);
}
