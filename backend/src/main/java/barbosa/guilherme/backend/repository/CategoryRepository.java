package barbosa.guilherme.backend.repository;

import barbosa.guilherme.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
