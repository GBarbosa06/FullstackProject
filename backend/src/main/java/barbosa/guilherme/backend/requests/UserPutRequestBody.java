package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserPutRequestBody {
    @NotNull(message = "The id field cannot be null")
    private Long id;

    private String name;

    @Email(message = "The email is not valid")
    private String email;

    private String password;
}
