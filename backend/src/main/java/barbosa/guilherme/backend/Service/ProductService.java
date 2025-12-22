package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Product;
import barbosa.guilherme.backend.repository.ProductRepository;
import barbosa.guilherme.backend.requests.ProductPostRequestBody;
import barbosa.guilherme.backend.requests.ProductPutRequestBody;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void delete(long id) {
        repository.delete(findByIdOrThrowBadRequestException(id));
    }

    public void update(ProductPutRequestBody productPutRequestBody){
        Product savedProduct = findByIdOrThrowBadRequestException(productPutRequestBody.getId());

        if (productPutRequestBody.getName() != null && !productPutRequestBody.getName().isBlank()) {
            savedProduct.setName(productPutRequestBody.getName());
        }
        if (productPutRequestBody.getDescription() != null && !productPutRequestBody.getDescription().isBlank()) {
            savedProduct.setDescription(productPutRequestBody.getDescription());
        }
        if(productPutRequestBody.getPrice() >= 0){
            savedProduct.setPrice(productPutRequestBody.getPrice());
        }

        repository.save(savedProduct);
    }
}
