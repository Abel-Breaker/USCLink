package USCLink.USCLink.service;

import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(String username, String email, Long telephone) throws IllegalArgumentException {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setTelephone(telephone);
        if (!userExist(username)) {
            System.out.println("Creating user: " + username + ", " + email + ", " + telephone);
            return userRepository.save(user);
        } else {
            throw new IllegalArgumentException("El usuario ya existe: " + username);
        }
    }

    public Set<User> getCoincidentUsersByUsername(String username) {
        return userRepository.findAllByUsername(username);
    }

    public Page<User> getUsers(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public boolean userExist(String username){
        return userRepository.existsByUsername(username);
    }
}