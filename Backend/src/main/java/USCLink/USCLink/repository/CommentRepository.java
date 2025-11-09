package USCLink.USCLink.repository;

import USCLink.USCLink.model.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long> {

    // Buscar los commentarios
    Page<Comment> findAll(Pageable pageRequest);

    // Buscar los comentarios por id
    Set<Comment> findAllById(Long id);

    // Buscar los comentarios por el id del post
    Page<Comment> findAllByPostId(Long postId, Pageable pageRequest);
}
