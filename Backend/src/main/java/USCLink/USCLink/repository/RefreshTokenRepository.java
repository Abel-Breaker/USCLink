package USCLink.USCLink.repository;

import USCLink.USCLink.model.RefreshToken;

import org.springframework.data.jpa.repository.Modifying;
//import org.jspecify.annotations.NullMarked;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;

@SuppressWarnings("UnusedReturnValue")
//@NullMarked
@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    @Transactional
    @Modifying
    Collection<RefreshToken> deleteAllByUser(String user);
    Optional<RefreshToken> findByToken(String token);
}
