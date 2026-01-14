package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPostRequestBody {
    @NotBlank
    @Size(min = 3, message = "Name must have at least 3 characters")
    private String name;

    private String description;

    @NotNull
    @PositiveOrZero
    private Double price;

    @NotNull
    private Long categoryId;
}
