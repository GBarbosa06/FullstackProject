package barbosa.guilherme.backend.controller;

import barbosa.guilherme.backend.service.CategoryService;
import barbosa.guilherme.backend.model.Category;
import barbosa.guilherme.backend.requests.CategoryPostRequestBody;
import barbosa.guilherme.backend.requests.CategoryPutRequestBody;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService service;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.service = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping(path = "/find/{id}")
    public ResponseEntity<Category> findById(@PathVariable long id) {
        return ResponseEntity.ok(service.findByIdOrThrowBadRequestException(id));
    }

    @PostMapping(path = "/add")
    public ResponseEntity<Category> add (@RequestBody @Valid CategoryPostRequestBody categoryPostRequestBody) {
        return new ResponseEntity<>(service.save(categoryPostRequestBody) ,HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteById(@RequestParam long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Category> update(@RequestBody @Valid CategoryPutRequestBody categoryPutRequestBody) {
        service.update(categoryPutRequestBody);
        return ResponseEntity.ok(service.findByIdOrThrowBadRequestException(categoryPutRequestBody.getId()));
    }
}
