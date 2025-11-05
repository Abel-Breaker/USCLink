package USCLink.USCLink.service;

import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(User user, String fileName, String caption) {
        Post post = new Post(user, fileName, caption);
        System.out.println("Creating post for user: " + user.getUsername() + ", file: " + fileName);
        return postRepository.save(post);
    }

    public Page<Post> getPosts(PageRequest pageRequest) {
        return postRepository.findAll(pageRequest);
    }

    public Page<Post> getPostsFollowedByUser(String username, PageRequest pageRequest) {
        return postRepository.findPostsByUserFollowersUsername(username, pageRequest);
    }

    public Page<Post> getPostsByUserUsername(User user, PageRequest pageRequest) {
        return postRepository.findAllByUser(user, pageRequest);
    }
    
    public void likePost(Long post, User user) {
        Post existingPost = postRepository.findById(post).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        System.out.println(existingPost.getLikes());
        if (!existingPost.getLikes().contains(user)) {
            existingPost.getLikes().add(user);
            postRepository.save(existingPost);
        } 
    }

    public void dislikePost(Long post, User user) {
        Post existingPost = postRepository.findById(post).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        System.out.println(existingPost.getLikes());
        if (existingPost.getLikes().contains(user)) {
            existingPost.getLikes().remove(user);
            postRepository.save(existingPost);
        } 
    }

}