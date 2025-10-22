package USCLink.USCLink.repository;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface MessagesRepository extends CrudRepository<Message, Long> {

    // Buscar mensajes por los seguidores de un usuario
    @Query("SELECT message FROM Message m WHERE m.receiver like ?1 OR m.sender like ?1")
    Page<Message> findMessagesByUserFollowersUsername(String username, Pageable pageRequest);

}
