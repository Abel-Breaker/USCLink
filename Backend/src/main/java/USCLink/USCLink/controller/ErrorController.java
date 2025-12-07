package USCLink.USCLink.controller;

import USCLink.USCLink.exception.FileNotCompatibleException;
import USCLink.USCLink.exception.DuplicatedUserException;
import USCLink.USCLink.controller.UserController;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;



@RestControllerAdvice
public class ErrorController extends ResponseEntityExceptionHandler {
    @ExceptionHandler(FileNotCompatibleException.class)
    public ErrorResponse handle(FileNotCompatibleException ex) {
        ProblemDetail error = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        error.setDetail("The file is not compatible with the required format.");
        error.setType(MvcUriComponentsBuilder.fromController(ErrorController.class).pathSegment("error", "file-incompatible").build().toUri());
        error.setTitle("File "+ ex.getFileName()+ " not compatible");

        return ErrorResponse.builder(ex, error).build();
    }

    @ExceptionHandler(DuplicatedUserException.class)
    public ErrorResponse handle(DuplicatedUserException ex) {
        ProblemDetail error = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        error.setDetail("The user with username="+ex.getUser().getUsername()+" already exists in the database with the following data: "+ex.getUser().getUsername());
        error.setType(MvcUriComponentsBuilder.fromController(ErrorController.class).pathSegment("error", "duplicated-user").build().toUri());
        error.setTitle("User "+ex.getUser().getUsername()+ " already exists");

        return ErrorResponse.builder(ex, error)
                .header(HttpHeaders.LOCATION, MvcUriComponentsBuilder.fromMethodName(UserController.class, "getUser", ex.getUser().getUsername()).build().toUriString())
                .build();
    }
}

