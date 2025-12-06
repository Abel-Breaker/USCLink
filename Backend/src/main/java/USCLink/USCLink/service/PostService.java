package USCLink.USCLink.service;

import java.util.Set;
import java.io.File;
import java.util.List;

import USCLink.USCLink.exception.PostNotFoundException;
import USCLink.USCLink.model.Post;
import USCLink.USCLink.model.User;
import USCLink.USCLink.repository.PostRepository;
import USCLink.utils.patch.JsonPatch;
import USCLink.utils.patch.JsonPatchOperation;
import USCLink.utils.patch.exception.JsonPatchFailedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    private final ObjectMapper mapper;

    @Autowired
    public PostService(PostRepository postRepository, ObjectMapper mapper) {
        this.postRepository = postRepository;
        this.mapper = mapper;
    }


    public Post createPost(User user, String fileName, String caption) {
        Post post = new Post(user, fileName, caption);
        System.out.println("Creating post for user: " + user.getUsername() + ", file: " + fileName);
        return postRepository.save(post);
    }

    public Page<Post> getPosts(PageRequest pageRequest) {
        return postRepository.findAll(pageRequest);
    }

    public Set<Post> getCoincidentPostsById(Long id) {
        return postRepository.findAllById(id);
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

    public Post updatePost(Long id, List<JsonPatchOperation> changes) throws PostNotFoundException {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
        JsonNode patched = JsonPatch.apply(changes, mapper.convertValue(post, JsonNode.class));
        Post updated = mapper.convertValue(patched, Post.class);

        String deleteDir = post.getPathToFile();
        File deleteFile = new File(deleteDir);
        if (deleteFile.delete()) {
            System.out.println("Deleted old file: " + deleteDir);
        } else {
            System.out.println("Failed to delete old file: " + deleteDir);
        }

        return postRepository.save(updated);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }


}