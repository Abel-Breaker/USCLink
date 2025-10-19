package USCLink.USCLink.repository;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PostRepository extends CrudRepository<Post, Long> {

    // Buscar los posts
    Page<Post> findAll(Pageable pageRequest);

    // Buscar posts por los seguidores de un usuario
    @Query("SELECT p FROM Post p WHERE p.user.username IN (SELECT f.user2.username FROM Follow f WHERE f.user1.username = ?1)")
    Page<Post> findPostsByUserFollowersUsername(String username, Pageable pageRequest);

    // Buscar posts por el username del usuario
    Page<Post> findAllByUser(User user, Pageable pageRequest);
}
