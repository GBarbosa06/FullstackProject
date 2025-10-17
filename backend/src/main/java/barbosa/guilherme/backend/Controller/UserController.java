package barbosa.guilherme.backend.Controller;

import barbosa.guilherme.backend.Service.UserService;
import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.repository.UserRepository;
import barbosa.guilherme.backend.requests.UserPostRequestBody;
import barbosa.guilherme.backend.requests.UserPutRequestBody;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<User> save(@RequestBody @Valid UserPostRequestBody userPostRequestBody){
        return new ResponseEntity<>(service.save(userPostRequestBody), HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid UserPostRequestBody userPostRequestBody) throws BadRequestException {
        return new ResponseEntity<>(service.register(userPostRequestBody), HttpStatus.valueOf(201));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody @Valid UserPostRequestBody userPostRequestBody) throws BadRequestException {
        return new ResponseEntity<>(service.login(userPostRequestBody), HttpStatus.valueOf(200));
    }

    @GetMapping
    public ResponseEntity<List<User>> listAll(){
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<User> findById(@PathVariable long id) throws BadRequestException {
        return ResponseEntity.ok(service.findByIdOrThrowBadRequestException(id));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) throws BadRequestException {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<Void> update(@RequestBody UserPutRequestBody userPutRequestBody) throws BadRequestException {
        service.update(userPutRequestBody);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
