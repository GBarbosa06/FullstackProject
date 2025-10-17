package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private UserRepository repository;

    public List<User> listAll(){
        return repository.findAll();
    }
}
