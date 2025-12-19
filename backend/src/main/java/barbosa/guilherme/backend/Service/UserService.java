package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.repository.UserRepository;
import barbosa.guilherme.backend.requests.UserLoginRequestBody;
import barbosa.guilherme.backend.requests.UserPostRequestBody;
import barbosa.guilherme.backend.requests.UserPutRequestBody;
import barbosa.guilherme.backend.responses.TokenResponse;
import barbosa.guilherme.backend.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UserService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public List<User> listAll(){
        return repository.findAll();
    }

    public User findByIdOrThrowBadRequestException(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    public Optional<User> findByEmail(String email){
        return repository.findByEmail(email);
    }


    @Transactional
    public User save(UserPostRequestBody userPostRequestBody){
        User user = new User();
        user.setName(userPostRequestBody.getName());
        user.setEmail(userPostRequestBody.getEmail());
        user.setPassword(userPostRequestBody.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public void delete(long id) {
        repository.delete(findByIdOrThrowBadRequestException(id));
    }

    public void update(UserPutRequestBody userPutRequestBody) {
        User savedUser = findByIdOrThrowBadRequestException(userPutRequestBody.getId());

        if (userPutRequestBody.getName() != null && !userPutRequestBody.getName().isBlank()) {
            savedUser.setName(userPutRequestBody.getName());
        }

        if (userPutRequestBody.getEmail() != null && !userPutRequestBody.getEmail().isBlank()) {
            savedUser.setEmail(userPutRequestBody.getEmail());
        }

        if (userPutRequestBody.getPassword() != null && !userPutRequestBody.getPassword().isBlank()) {
            savedUser.setPassword(passwordEncoder.encode(userPutRequestBody.getPassword()));
        }

        repository.save(savedUser);
    }

    public TokenResponse register(UserPostRequestBody userPostRequestBody) {
        User user = new User();
        user.setName(userPostRequestBody.getName());
        user.setEmail(userPostRequestBody.getEmail());
        user.setPassword(userPostRequestBody.getPassword());

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be null.");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password cannot be null or empty");
        }

        Optional<User> existingUser = repository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new BadRequestException("Email already used");
        }

        Pattern passwordPattern = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");
        if (!passwordPattern.matcher(user.getPassword()).matches()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
            );
        }

        // encode
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // save
        repository.save(user);

        // generate token
        String token = jwtUtil.generateToken(user.getEmail());

        // return token
        return new TokenResponse(token);
    }



    public TokenResponse login(UserLoginRequestBody userLoginRequestBody) {
        Optional<User> searchedUser = repository.findByEmail(userLoginRequestBody.getEmail());

        if (searchedUser.isEmpty() ||
                !passwordEncoder.matches(userLoginRequestBody.getPassword(), searchedUser.get().getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        User user = searchedUser.get();
        String token = jwtUtil.generateToken(user.getEmail());

        return new TokenResponse(token);

    }

}