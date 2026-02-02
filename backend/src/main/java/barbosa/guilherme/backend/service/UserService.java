package barbosa.guilherme.backend.service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Role;
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
import java.util.Set;
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


    public void delete(long id) {
        repository.delete(findByIdOrThrowBadRequestException(id));
    }

    @Transactional
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

    @Transactional
    public TokenResponse register(UserPostRequestBody userPostRequestBody) {
        User user = new User();
        user.setName(userPostRequestBody.getName());
        user.setEmail(userPostRequestBody.getEmail());
        user.setPassword(userPostRequestBody.getPassword());

        Role userRole = new Role(1L, "USER");
        user.setRoles(Set.of(userRole));

        // Validate email
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new BadRequestException("Email cannot be null or empty");
        }

        // Validate password
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadRequestException("Password cannot be null or empty");
        }

        // Check if email already exists
        Optional<User> existingUser = repository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new BadRequestException("Email already used");
        }

        // Validate password strength
        Pattern passwordPattern = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");
        if (!passwordPattern.matcher(user.getPassword()).matches()) {
            throw new BadRequestException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit");
        }

        // Encode password and save user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);

        // Generate and return token directly
        String token = jwtUtil.generateToken(user.getEmail());
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