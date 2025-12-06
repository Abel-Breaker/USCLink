package USCLink.USCLink.exception;

public class FileNotSavedException extends Throwable {
    private final String file;

    public FileNotSavedException(String file) {
        this.file = file;
    }

    public String getFile() {
        return String.valueOf(file);
    }
}
