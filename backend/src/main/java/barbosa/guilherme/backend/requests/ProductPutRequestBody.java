package barbosa.guilherme.backend.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductPutRequestBody {
    @NotNull(message = "The id field cannot be null")
    private long id;

    @NotBlank
    @Size(min = 3, message = "Name must have at least 3 characters")
    private String name;

    private String description;

    @NotNull
    @PositiveOrZero
    private Double price;

    private Long categoryId;
}
