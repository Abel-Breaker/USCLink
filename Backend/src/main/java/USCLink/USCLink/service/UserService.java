package USCLink.USCLink.service;

import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.model.User;
import USCLink.USCLink.controller.ErrorController;
import USCLink.USCLink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) throws DuplicatedUserException {
        User newUser = user;
        if (!userExist(newUser.getUsername())) {
            System.out.println("Creating user: " + user.getUsername() + ", " + user.getEmail() + ", " + user.getTelephone());
            return userRepository.save(user);
        } else {
            System.out.println("User already exists: " + user.getUsername());
            throw new DuplicatedUserException(user);
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