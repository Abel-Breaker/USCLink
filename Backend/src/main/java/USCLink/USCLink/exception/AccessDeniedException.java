package USCLink.USCLink.exception;

public class AccessDeniedException extends Throwable {
    private final String username;

    public AccessDeniedException(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
