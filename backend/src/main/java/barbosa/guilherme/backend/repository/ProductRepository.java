package barbosa.guilherme.backend.repository;

import barbosa.guilherme.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
