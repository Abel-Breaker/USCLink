package USCLink.USCLink.service;

import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.model.Role;
import USCLink.USCLink.model.User;
import USCLink.USCLink.controller.ErrorController;
import USCLink.USCLink.repository.UserRepository;
import USCLink.USCLink.repository.RoleRepository;
import USCLink.USCLink.exception.DuplicatedUserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public User createUser(String username, String password, String email, Long telephone, String avatar, String biography) throws DuplicatedUserException {
        User newUser = new User(username, password, email, telephone, avatar, biography, Set.of(roleRepository.findById("USER").orElseThrow(() -> new RuntimeException("Role not found"))));;
        if (!userExist(newUser.getUsername())) {
            System.out.println("Creating user: " + newUser.getUsername() + ", " + newUser.getEmail() + ", " + newUser.getTelephone());
            newUser.setPassword(passwordEncoder.encode(password));
            return userRepository.save(newUser);
        } else {
            System.out.println("User already exists: " + newUser.getUsername());
            throw new DuplicatedUserException(newUser);
        }
    }

    public Set<User> getCoincidentUsersByUsername(String username) {
        return userRepository.findAllByUsername(username);
    }
    public Page<User> getUsersByUsernameNotContaining(String username, PageRequest pageRequest) {
        return userRepository.findAllByNotUsername(username, pageRequest);
    }

    public Page<User> getUsers(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    public boolean userExist(String username){
        return userRepository.existsByUsername(username);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        Set<User> users = userRepository.findByUsername(username);
        if (users.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        } 
        return userRepository.findByUsername(username).iterator().next();
    }

    public Page<User> get(PageRequest page) {
        return userRepository.findAll(page);
    }

    public User get(String username){
        return loadUserByUsername(username);
    }

    public void deleteUser(String username) {
        User user = loadUserByUsername(username);
        userRepository.delete(user);
    }

}