package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.mapper.UserMapper;
import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.repository.UserRepository;
import barbosa.guilherme.backend.requests.UserLoginRequestBody;
import barbosa.guilherme.backend.requests.UserPostRequestBody;
import barbosa.guilherme.backend.requests.UserPutRequestBody;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repository;
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> listAll(){
        return repository.findAll();
    }

    public User findByIdOrThrowBadRequestException(long id) throws BadRequestException {
        return repository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    public Optional<User> findByEmail(String email){
        return repository.findByEmail(email);
    }


    @Transactional
    public User save(UserPostRequestBody userPostRequestBody){
        return repository.save(UserMapper.INSTANCE.toUser(userPostRequestBody));
    }

    public void delete(long id) throws BadRequestException {
        repository.delete(findByIdOrThrowBadRequestException(id));
    }

    public void update(UserPutRequestBody userPutRequestBody) throws BadRequestException {
        User saverUser = findByIdOrThrowBadRequestException(userPutRequestBody.getId());
        User user = UserMapper.INSTANCE.toUser(userPutRequestBody);
        user.setId(saverUser.getId());
        repository.save(user);
    }

    public User register(UserPostRequestBody userPostRequestBody) throws BadRequestException {
        User user = UserMapper.INSTANCE.toUser(userPostRequestBody);
        Optional<User> existingUser = repository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new BadRequestException("Email already used");
        }

        if (user.getPassword().length() < 6){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");

        }

        return save(userPostRequestBody);
    }

    public User login(UserLoginRequestBody userLoginRequestBody) throws BadRequestException {
        User user = UserMapper.INSTANCE.toUser(userLoginRequestBody);
        Optional<User> searchedUser = repository.findByEmail(user.getEmail());

        if (searchedUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found");

        }

        User u = searchedUser.get();
        // use BCryptPasswordEncoder
        if (!u.getPassword().equals(user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect password");

        }
        u.setPassword("hidden");
        return u;
    }
}