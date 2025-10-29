package USCLink.USCLink.repository;

import USCLink.USCLink.model.Message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessagesRepository extends CrudRepository<Message, Long> {

    // Obtener todos los mensajes de un chat
    Page<Message> findByChatId_Id(Long chatId, Pageable pageable);

}
