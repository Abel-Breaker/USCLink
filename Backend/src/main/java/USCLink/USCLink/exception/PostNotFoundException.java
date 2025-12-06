package USCLink.USCLink.exception;

public class PostNotFoundException extends Throwable {
    private final long id;

    public PostNotFoundException(long id) {
        this.id = id;
    }

    public String getId() {
        return String.valueOf(id);
    }
}

