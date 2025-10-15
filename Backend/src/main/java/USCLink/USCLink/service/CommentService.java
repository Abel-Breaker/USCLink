package USCLink.USCLink.service;

import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.CommentRepository;
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
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(User user, Post post, String content) {
        Comment comment = new Comment(user, post, content);
        System.out.println("Creating comment for user: " + user + ", post: " + post + ", content: " + content);
        return commentRepository.save(comment);
    }

    public Page<Comment> getComments(PageRequest pageRequest) {
        return commentRepository.findAll(pageRequest);
    }

    public Set<Comment> getCoincidentCommentsById(Long id) {
        return commentRepository.findAllById(id);
    }
    
}