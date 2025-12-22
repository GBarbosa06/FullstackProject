package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Category;
import barbosa.guilherme.backend.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {this.repository = repository;}

    public List<Category> listAll() {return repository.findAll();}

    public Category findByIdOrThrowBadRequestException(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new BadRequestException("Category not found"));
    }

    @Transactional
    public Category save()
}
