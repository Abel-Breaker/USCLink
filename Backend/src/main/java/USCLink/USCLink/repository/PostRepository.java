package USCLink.USCLink.repository;

import USCLink.USCLink.model.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface PostRepository extends CrudRepository<Post, Long> {
}
