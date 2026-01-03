package barbosa.guilherme.backend.repository;

import barbosa.guilherme.backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
