package USCLink.USCLink.repository;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.model.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface MessagesRepository extends CrudRepository<Message, Long> {

    // Obtener todos los mensajes de un chat
    Page<Message> findByChatId_Id(Long chatId, Pageable pageable);

}
