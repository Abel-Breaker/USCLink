package USCLink.USCLink.service;

import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.model.Role;
import USCLink.USCLink.model.User;
import USCLink.USCLink.controller.ErrorController;
import USCLink.USCLink.repository.UserRepository;
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

    @Override
    public User loadUserByUsername(String username) throws Exception {
        return userRepository.findByUsername(username).orElseThrow(() -> new Exception(username));
    }

    public Page<User> get(PageRequest page) {
        return userRepository.findAll(page);
    }

    public User get(String username){
        return loadUserByUsername(username);
    }

    public User create(User user) throws DuplicateUserException {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateUserException(user);
        }

        Role userRole = roleRepository.findByRolename("USER");

        return userRepository.save(
                new User(
                        user.getUsername(),
                        passwordEncoder.encode(user.getPassword()),
                        Set.of(userRole)
                )
        );
    }

}