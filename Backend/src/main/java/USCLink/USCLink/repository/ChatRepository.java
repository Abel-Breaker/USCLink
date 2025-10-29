package USCLink.USCLink.repository;

import USCLink.USCLink.model.Chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChatRepository extends PagingAndSortingRepository<Chat, Long> {

    // Returns all chats where the user with username X participates
    Page<Chat> findByUsers_Username(String username, Pageable pageable);

}

