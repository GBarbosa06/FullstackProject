package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserLoginRequestBody {
    @NotEmpty(message = "The email field cannot be empty")
    private String email;

    @NotEmpty(message = "The password field cannot be empty")
    private String password;
}
