package USCLink.USCLink.exception;

public class FileNotCompatibleException extends Throwable{
    private final String fileName;

    public FileNotCompatibleException(String fileName) {
        this.fileName = fileName;
    }

    public String getFileName() {
        return fileName;
    }
}