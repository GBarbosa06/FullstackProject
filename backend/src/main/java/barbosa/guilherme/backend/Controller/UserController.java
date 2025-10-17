package barbosa.guilherme.backend.Controller;

import barbosa.guilherme.backend.Service.UserService;
import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private UserService service;

    @Autowired
    private UserRepository repository;

    @PostMapping
    public ResponseEntity<User> save(@Valid @RequestBody User user){
        User newUser = repository.save(user);
        return ResponseEntity.status(201).body(newUser);
    }

    @GetMapping
    public ResponseEntity<List<User>> listAll(){
        return ResponseEntity.ok(service.listAll());
    }
}
