package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UserPostRequestBody {
    @NotEmpty(message = "The name field cannot be empty")
    private String name;

    @NotEmpty(message = "The email field cannot be empty")
    private String email;

    @NotEmpty(message = "The password field cannot be empty")
    private String password;

    @URL(message = "The url is not valid")
    private String url;
}
