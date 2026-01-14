package barbosa.guilherme.backend.controller;

import barbosa.guilherme.backend.service.ProductService;
import barbosa.guilherme.backend.model.Product;
import barbosa.guilherme.backend.requests.ProductPostRequestBody;
import barbosa.guilherme.backend.requests.ProductPutRequestBody;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Product>> listAll() {return ResponseEntity.ok(service.listAll());}

    @GetMapping(path = "/find/{id}")
    public ResponseEntity<Product> findById(@PathVariable long id){
        return ResponseEntity.ok(service.findByIdOrThrowBadRequestException(id));
    }

    @PostMapping("/add")
    public ResponseEntity<Product> add(@RequestBody ProductPostRequestBody productPostRequestBody) {
        //return ResponseEntity.ok(service.save(productPostRequestBody));
        return new ResponseEntity<>(service.save(productPostRequestBody), HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping
    public ResponseEntity<Void> update (@RequestBody @Valid ProductPutRequestBody productPutRequestBody){
        service.update(productPutRequestBody);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
