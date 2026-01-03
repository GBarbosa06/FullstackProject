package barbosa.guilherme.backend.requests;

import barbosa.guilherme.backend.model.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class StockPutRequestBody {
    @NotNull(message = "The id field cannot be null")
    private long id;

    @NotBlank
    private Product product;

    @NotNull
    @PositiveOrZero
    private Integer quantity;
}
