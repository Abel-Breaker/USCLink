package USCLink.USCLink.service;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.PostRepository;
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
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(User user, String fileName) {
        Post post = new Post(user, fileName);
        System.out.println("Creating post for user: " + user.getUsername() + ", file: " + fileName);
        return postRepository.save(post);
    }

    public Page<Post> getPosts(PageRequest pageRequest) {
        return postRepository.findAll(pageRequest);
    }
    
}