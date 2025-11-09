package USCLink.USCLink.service;

import USCLink.USCLink.model.Comment;
import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.CommentRepository;
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

    public Page<Comment> getCommentsByPostId(Long postId, PageRequest pageRequest) {
        return commentRepository.findAllByPostId(postId, pageRequest);
    }

    public void likeComment(Long comment, User user) {
        Comment existingComment = commentRepository.findById(comment).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        System.out.println(existingComment.getLikes());
        if (!existingComment.getLikes().contains(user)) {
            existingComment.getLikes().add(user);
            commentRepository.save(existingComment);
        } 
    }

    public void dislikeComment(Long comment, User user) {
        Comment existingComment = commentRepository.findById(comment).orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        System.out.println(existingComment.getLikes());
        if (existingComment.getLikes().contains(user)) {
            existingComment.getLikes().remove(user);
            commentRepository.save(existingComment);
        } 
    }
    
}