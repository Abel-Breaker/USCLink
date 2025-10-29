package USCLink.USCLink.repository;

import USCLink.USCLink.model.Chat;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ChatRepository extends PagingAndSortingRepository<Chat, Long> {


}

