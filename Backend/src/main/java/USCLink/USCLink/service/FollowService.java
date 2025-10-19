package USCLink.USCLink.service;

import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.Follow;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.FollowRepository;
import USCLink.USCLink.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public Follow createFollow(User user, User user2) {
        Follow follow = new Follow(user, user2);
        System.out.println("Creating follow for user: " + user.getUsername() + "to user: " + user2.getUsername());
        return followRepository.save(follow);
    }

    public Page<Follow> getFollows(PageRequest pageRequest) {
        return followRepository.findAll(pageRequest);
    }

    public Set<Follow> getCoincidentFollowsById(Long id) {
        return followRepository.findAllById(id);
    }

    public Page<Follow> getFollowsByFollowedUsername(String username, PageRequest pageRequest) {
        return followRepository.findAllByFollowedUsername(username, pageRequest);
    }

    public Page<Follow> getFollowsByFollowerUsername(String username, PageRequest pageRequest) {
        return followRepository.findAllByFollowerUsername(username, pageRequest);
    }
    
}