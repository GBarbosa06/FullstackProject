package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryPutRequestBody {
    @NotNull(message = "The id field cannot be null")
    private long id;

    @NotBlank
    @Size(min = 2, max = 100, message = "Name length must be between 2 and 100")
    private String name;

    @NotBlank
    @Size(min = 2, max = 100, message = "Slug length must be between 2 and 100")
    private String slug;
}
