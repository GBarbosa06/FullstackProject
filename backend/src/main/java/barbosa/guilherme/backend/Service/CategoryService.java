package barbosa.guilherme.backend.Service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Category;
import barbosa.guilherme.backend.repository.CategoryRepository;
import barbosa.guilherme.backend.requests.CategoryPostRequestBody;
import barbosa.guilherme.backend.requests.CategoryPutRequestBody;
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
    public Category save(CategoryPostRequestBody categoryPostRequestBody){
        Category newCategory = new  Category();
        newCategory.setName(categoryPostRequestBody.getName());
        newCategory.setSlug(categoryPostRequestBody.getSlug());
        return newCategory;
    }

    public void delete(long id){repository.delete(findByIdOrThrowBadRequestException(id));}

    public void update(CategoryPutRequestBody categoryPutRequestBody){
        Category updatedCategory = findByIdOrThrowBadRequestException(categoryPutRequestBody.getId());

        if(categoryPutRequestBody.getName() != null) updatedCategory.setName(categoryPutRequestBody.getName());
        if(categoryPutRequestBody.getSlug() != null) updatedCategory.setSlug(categoryPutRequestBody.getSlug());
        repository.save(updatedCategory);
    }

}
