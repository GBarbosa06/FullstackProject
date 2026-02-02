package barbosa.guilherme.backend.requests;

import barbosa.guilherme.backend.model.Product;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class StockPostRequestBody {
    @NotNull(message = "Product is required")
    private Product product;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity must be positive or zero")
    private Integer quantity;
}
