package barbosa.guilherme.backend.service;

import barbosa.guilherme.backend.exception.BadRequestException;
import barbosa.guilherme.backend.model.Stock;
import barbosa.guilherme.backend.repository.StockRepository;
import barbosa.guilherme.backend.requests.StockPostRequestBody;
import barbosa.guilherme.backend.requests.StockPutRequestBody;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {
    private final StockRepository repository;

    public StockService(StockRepository repository) {
        this.repository = repository;
    }

    public List<Stock> findAll() {return repository.findAll();}

    public Stock findByIdOrThrowBadRequestException(long id){
        return repository.findById(id)
                .orElseThrow(() -> new BadRequestException("Stock not found"));
    }

    @Transactional
    public Stock save(StockPostRequestBody stockPostRequestBody){
        Stock newStock = new Stock();
        newStock.setProduct(stockPostRequestBody.getProduct());
        newStock.setQuantity(stockPostRequestBody.getQuantity());
        return repository.save(newStock);
    }

    public void deleteById(long id){
        repository.deleteById(findByIdOrThrowBadRequestException(id).getId());
    }

    public void update(StockPutRequestBody stockPutRequestBody){
        Stock stockToUpdate = findByIdOrThrowBadRequestException(stockPutRequestBody.getId());

        if(stockPutRequestBody.getQuantity() >= 0) {
            stockToUpdate.setQuantity(stockPutRequestBody.getQuantity());
        }
        if(stockPutRequestBody.getProduct() != null) {
            stockToUpdate.setProduct(stockPutRequestBody.getProduct());
        }
        repository.save(stockToUpdate);
    }


}
