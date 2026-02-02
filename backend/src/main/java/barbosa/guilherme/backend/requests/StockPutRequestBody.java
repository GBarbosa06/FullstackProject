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

    @NotNull(message = "Product is required")
    private Product product;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity must be positive or zero")
    private Integer quantity;
}
