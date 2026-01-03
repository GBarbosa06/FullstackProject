package barbosa.guilherme.backend.requests;

import barbosa.guilherme.backend.model.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class StockPostRequestBody {
    @NotBlank
    private Product product;

    @NotNull
    @PositiveOrZero
    private Integer quantity;
}
