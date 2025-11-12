package USCLink.USCLink.repository;

import USCLink.USCLink.model.Role;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
@NullMarked
public interface RoleRepository extends CrudRepository<Role, String> {
    Role findByRolename(String rolename);
}
