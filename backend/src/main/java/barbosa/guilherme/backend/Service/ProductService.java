package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Product;
import barbosa.guilherme.backend.repository.ProductRepository;
import barbosa.guilherme.backend.requests.ProductPostRequestBody;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> listAll() {
        return repository.findAll();
    }

    public Product findByIdOrThrowBadRequestException(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new BadRequestException("Product not found"));
    }

    @Transactional
    public Product save(ProductPostRequestBody productPostRequestBody) {
        Product newProduct = new Product();
        newProduct.setName(productPostRequestBody.getName());
        newProduct.setDescription(productPostRequestBody.getDescription());
        newProduct.setPrice(productPostRequestBody.getPrice());
        return repository.save(newProduct);
    }

}
